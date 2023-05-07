import { reactive } from 'vue'
import { defineStore } from 'pinia'
import Radio from 'app/server/models/Radio'
import axios from 'axios'
import useStreamRadio from 'src/compositions/StreamRadio'
import { LocalStorage } from 'quasar'
import useNotify from 'src/compositions/useNotify'
import useEventBust from 'src/compositions/useEvent'

export const useRadioStore = defineStore('radio', {
  state: () => ({
    name: '',
    pageIndex: {
      countries: [],
      radios: [],
      places: [],
      liked: [],
      favorites: [],
      mostLiked: [],
      recent: [],
    },
    player: {
      playing: false,
      loading: false,
    },
    // radio: new Radio(),
    radio: {
      _id: '',
      href: '',
      title: ' ',
      placeId: '',
      id: '',
      url: '',
      website: '',
      secure: false,
      place: {
        id: '',
        title: '',
      },
      country: {
        id: '',
        title: '',
      },
      stream: '',
      verified: true,
      errMessage: '',
      likes: 0,
      visits: 0,
    },
    metaData: {
      title: 'Zip Radio',
      titleTemplate: (title) => `${title} - Zip World Radio Stations`,
      meta: {
        description: {
          name: 'description',
          content: 'Zip World Radio Stations',
        },
        keywords: {
          name: 'keywords',
          content: 'zip, world, radio, stations, stream',
        },
        // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
        ogTitle: {
          property: 'og:title',
          // optional; similar to titleTemplate, but allows templating with other meta properties
          template(title) {
            return `${title} - Zip World Radio Stations`
          },
        },
      },
    },
    map: {
      options: {
        disableDefaultUI: true,
        mapTypeControl: false,
        dark: true,
        styles: [
          {
            featureType: 'all',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
          {
            elementType: 'geometry',
            stylers: [{ color: '#242f3e', visibility: 'off' }],
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#242f3e', visibility: 'off' }],
          },
          {
            elementType: 'labels.text.fill',
            stylers: [{ color: '#746855', visibility: 'off' }],
          },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563', visibility: 'off' }],
          },
          {
            visibility: 'off',
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563', visibility: 'off' }],
          },
          {
            visibility: 'off',
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f', visibility: 'off' }],
          },
          {
            visibility: 'off',
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9a76', visibility: 'off' }],
          },
          {
            visibility: 'off',
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e', visibility: 'off' }],
          },
          {
            visibility: 'off',
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37', visibility: 'off' }],
          },
          {
            visibility: 'off',
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3', visibility: 'off' }],
          },
          {
            visibility: 'off',
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855', visibility: 'off' }],
          },
          {
            visibility: 'off',
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835', visibility: 'off' }],
          },
          {
            visibility: 'off',
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f3d19c', visibility: 'off' }],
          },
          {
            visibility: 'off',
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948', visibility: 'off' }],
          },
          {
            visibility: 'off',
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563', visibility: 'off' }],
          },
          {
            visibility: 'off',
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }],
          },
          {
            visibility: 'off',
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }],
          },
          {
            visibility: 'off',
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }],
          },
        ],
      },
      center: { lat: 51.093048, lng: 6.84212 },
      markers: [],
    },
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
    radioTitle: (state) => state.radio.title,
    radioCountry: (state) => state.radio.country.title,
    radioPlace: (state) => state.radio.place.title,
  },
  actions: {
    latLonToOffsets(latitude, longitude, mapWidth, mapHeight) {
      const radius = mapWidth / (2 * Math.PI)
      const FE = 180 // false easting

      const lonRad = this.degreesToRadians(longitude + FE)
      const x = lonRad * radius

      const latRad = this.degreesToRadians(latitude)
      const verticalOffsetFromEquator = radius * Math.log(Math.tan(Math.PI / 4 + latRad / 2))
      const y = mapHeight / 2 - verticalOffsetFromEquator

      return { x, y }
    },
    degreesToRadians(degrees) {
      return (degrees * Math.PI) / 180
    },
    async loadIndexData() {
      const resp = await axios.get(import.meta.env.VITE_API_BASE + '/radio/index')
      this.pageIndex.countries = resp.data.data.countries
      this.pageIndex.radios = resp.data.data.radios
      this.pageIndex.places = resp.data.data.places
      return this
    },
    async loadGlobeData() {
      const resp = await axios.get(import.meta.env.VITE_API_BASE + '/radio/globe/data')
      this.map.markers = []
      for (let i = 0; i < resp.data.data.length; ++i) {
        const place = resp.data.data[i]
        let lat = place.geo[1]
        let lng = place.geo[0]
        const marker = {
          position: { _id: place._id, lat: lat, lng: lng, total: place.total },
        }
        this.map.markers.push(marker)
      }
      useEventBust.emit('GlobeData')
      // console.log(this.map.markers);
    },
    async searchRadioPlace(val) {
      const resp = await axios.get(import.meta.env.VITE_API_BASE + '/search/radio/place?p=' + val)
      return resp.data.data
    },
    async nextRadio() {
      if (this.pageIndex.radios.length === 0) {
        return null
      }
      let index = this.pageIndex.radios.findIndex((r) => r._id === this.radio._id)
      if (index >= this.pageIndex.radios.length - 1) {
        index = 0
      } else {
        index++
      }
      return this.pageIndex.radios[index]
    },
    async prevRadio() {
      if (this.pageIndex.radios.length === 0) {
        return null
      }
      let index = this.pageIndex.radios.findIndex((r) => r._id === this.radio._id)
      if (index <= 0) {
        index = this.pageIndex.radios.length - 1
      } else {
        index--
      }
      return this.pageIndex.radios[index]
    },
    // if populate is true then data.radio will be pupulated in reactive data, otherwise function just return radio from database
    async getRadio(radioId, populate = true) {
      const resp = await axios.get(import.meta.env.VITE_API_BASE + '/radio/' + radioId)
      if (populate) {
        this.radio = resp.data.data
        this.pageIndex.radios = resp.data.nearby.radios
        this.pageIndex.places = resp.data.nearby.places
        this.pageIndex.countries = resp.data.nearby.countries
      }
      return resp.data.data
    },
    async getRadiosByPlace(placeId, populate = true) {
      const resp = await axios.get(import.meta.env.VITE_API_BASE + '/radio/by/place/' + placeId)
      if (populate) {
        // this.radio = resp.data.data
        this.pageIndex.radios = resp.data.data
        this.pageIndex.places = resp.data.nearby.places
        this.pageIndex.countries = resp.data.nearby.countries
      }
      return resp.data.data
    },
    async getRadiosByPlaceURL(url, populate = true) {
      const resp = await axios.get(import.meta.env.VITE_API_BASE + '/radio/by/place/url?url=' + url)
      if (populate) {
        // this.radio = resp.data.data
        this.pageIndex.radios = resp.data.data
        this.pageIndex.places = resp.data.nearby.places
        this.pageIndex.countries = resp.data.nearby.countries
      }
      return resp.data.data
    },
    async getRadioByURL(url, populate = true, autoPlay = false, populateRadio = false) {
      const resp = await axios.get(import.meta.env.VITE_API_BASE + '/radio/by/url?url=' + url)
      if (populate) {
        this.radio = reactive(resp.data.data)
        this.metaData.title = this.radio.title + ' ' + this.radio.place.title + ' ' + this.radio.country.title
        if (populateRadio) this.pageIndex.radios = resp.data.nearby.radios
        this.pageIndex.places = resp.data.nearby.places
        this.pageIndex.countries = resp.data.nearby.countries
        if (autoPlay) useStreamRadio.play(this.radio)
      }
      return resp.data.data
    },
    // _id is objectId _id in database not id radio, function increment like and return number of current likes
    async likeRadioById(_id) {
      const resp = await axios.post(import.meta.env.VITE_API_BASE + '/radio/like/' + _id)
      console.log(resp.data.data)
      return resp.data
    },
    async addToFavorites() {
      if (this.radio._id === '') return
      const found = this.pageIndex.favorites.find((r) => this.radio._id === r._id)
      if (!found) {
        const key = 'favorites'
        this.pageIndex.favorites.push(this.radio)
        LocalStorage.set(key, JSON.stringify(this.pageIndex.favorites))
        useNotify.info('Radio ' + this.radio.title + ' added to favorites!')
      } else {
        useNotify.info('Radio ' + this.radio.title + ' has already been added to favorites!')
      }
    },
    async loadFavorites() {
      const key = 'favorites'
      // LocalStorage.remove(key)
      if (LocalStorage.has(key)) {
        const list = JSON.parse(LocalStorage.getItem(key))
        this.pageIndex.favorites = list
      }
    },
  },
})
