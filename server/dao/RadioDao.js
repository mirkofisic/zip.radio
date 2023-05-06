import { ObjectId } from 'mongodb'
import Collection from '../models/Collection'
import { RandomCountries } from '../models/Const'
class RadioDao {
  constructor() {
    this.PLACES = null
    this.RADIOS = null
    this.COUNTRIES = null
  }

  injectDb = async (mongoClient) => {
    this.PLACES = await mongoClient.db(process.env.DB_NAME).collection(Collection.PLACES)
    this.RADIOS = await mongoClient.db(process.env.DB_NAME).collection(Collection.RADIOS)
    this.COUNTRIES = await mongoClient.db(process.env.DB_NAME).collection(Collection.COUNTRIES)
  }

  getGlobeData = async () => {
    return await this.PLACES.aggregate([{ $project: { geo: 1, title: 1, country: 1, total: 1, _id: 1 } }]).toArray()
  }

  likeRadioById = async (id) => {
    await this.RADIOS.updateOne({ _id: new ObjectId(id) }, { $inc: { likes: 1 } })
    const likes = await this.RADIOS.findOne({ _id: new ObjectId(id) }, { projection: { likes: 1 } })
    return likes
  }

  searchRadioPlace = async (param) => {
    return await this.RADIOS.aggregate([
      {
        $match: {
          title: {
            $regex: new RegExp(param, 'i'),
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          stream: 1,
          country: 1,
          url: 1,
        },
      },
      { $limit: 10 },
      {
        $unionWith: {
          coll: 'places',
          pipeline: [
            {
              $match: {
                title: {
                  $regex: new RegExp(param, 'i'),
                },
              },
            },
            {
              $project: {
                _id: 1,
                title: 1,
                country: 1,
                url: 1,
              },
            },
          ],
        },
      },
    ]).toArray()
  }

  getRadioByUrl = async (url) => {
    const radio = await this.RADIOS.findOne({ url })
    // get radio place
    const place = await this.PLACES.findOne({ id: radio.place.id })
    // get nearby radios, places, countries
    const radios = await this.RADIOS.find({ placeId: radio.place.id }).toArray()
    const nearby = await this.getNearby(place.geo, [Collection.PLACES, Collection.COUNTRIES])
    nearby.radios = radios
    return { nearby, radio }
  }

  getIndexRadios = async () => {
    const countryFilter = await RandomCountries(10)
    const countries = countryFilter /* await this.COUNTRIES.find({ country: { $in: countryFilter } })
      .limit(countryFilter.length)
      .toArray() */ //potrebno provjeriti baza nije napunjena sa countries

    //console.log(countries)
    // get random 10 places
    const places = []
    for (let i = 0; i < countries.length; ++i) {
      const place = await this.PLACES.findOne({ code: countries[i].code })
      if (place) places.push(place)
    }
    // get radios from current place now is Bosnia, later use by ip address
    const radios = await this.RADIOS.find({
      'country.title': { $regex: 'Bosnia and Herzegovina', $options: 'i' },
    })
      .limit(12)
      .toArray()
    return {
      countries,
      radios,
      places,
      liked: [],
      favorites: [],
      mostLiked: [],
    }
  }

  getRadioById = async (id) => {
    const radio = await this.RADIOS.findOne({ id })
    console.log(radio)
    // get radio place
    const place = await this.PLACES.findOne({ id: radio.place.id })
    console.log(place)
    // get nearby radios, places, countries
    const nearby = await this.getNearby(place.geo, [Collection.RADIOS, Collection.PLACES, Collection.COUNTRIES])
    return { radio, nearby }
  }

  getRadiosByPlace = async (_id) => {
    // console.log('getRadiosByPlace', _id)
    const place = await this.PLACES.findOne({ _id: new ObjectId(_id) })
    const radios = await this.RADIOS.find({ placeId: place.id }).toArray()
    // get nearby places, countries
    const nearby = await this.getNearby(place.geo, [Collection.PLACES, Collection.COUNTRIES])
    return { radios, nearby }
  }

  getRadiosByPlaceURL = async (url) => {
    // console.log('getRadiosByPlaceURL', url)
    const place = await this.PLACES.findOne({ url: url })
    const radios = await this.RADIOS.find({ placeId: place.id }).toArray()
    // get nearby places, countries
    const nearby = await this.getNearby(place.geo, [Collection.PLACES, Collection.COUNTRIES])
    return { radios, nearby }
  }

  getNearbyRadios = async (geo) => {
    const result = await this.PLACES.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [geo[0], geo[1]] },
          distanceField: 'geo',
          maxDistance: 1_000_000,
          minDistance: 2,
          includeLocs: 'geo',
          spherical: true,
        },
      },
      { $limit: 12 },
    ]).toArray()
    // calculate maximum number of radios per place
    const allRadios = []
    if (result.length > 0) {
      const limit = Math.round(10 / result.length)
      for (let i = 0; i < result.length; ++i) {
        const place = result[i]
        const radios = await this.RADIOS.find({ 'place.id': place.id }).limit(limit).toArray()
        allRadios.push(...radios)
      }
    }
    return allRadios
  }

  getNearbyPlaces = async (geo) => {
    const result = await this.PLACES.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [geo[0], geo[1]] },
          distanceField: 'geo',
          maxDistance: 1_000_000,
          minDistance: 2,
          includeLocs: 'geo',
          spherical: true,
        },
      },
      { $limit: 12 },
    ]).toArray()
    return result
  }

  getNearbyCountries = async (geo) => {
    const result = await this.PLACES.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [geo[0], geo[1]] },
          distanceField: 'geo',
          maxDistance: 1_000_000,
          minDistance: 2,
          includeLocs: 'geo',
          spherical: true,
        },
      },
      {
        $group: {
          _id: '$code',
          code: { $first: '$code' },
          title: { $first: '$country' },
          url: { $first: '$countryUrl' },
          totalRadios: { $sum: '$total' },
        },
      },
      { $limit: 12 },
    ]).toArray()
    return result
  }

  getNearby = async (geo, locations) => {
    const nearby = { radios: [], places: [], countries: [] }
    if (locations.includes(Collection.PLACES)) {
      nearby.places = await this.getNearbyPlaces(geo)
    }
    if (locations.includes(Collection.COUNTRIES)) {
      nearby.countries = await this.getNearbyCountries(geo)
    }
    if (locations.includes(Collection.RADIOS)) {
      nearby.radios = await this.getNearbyRadios(geo)
    }
    return nearby
  }
}
const RadiosDao = new RadioDao()
export { RadiosDao }
