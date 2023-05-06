import Resp from '../models/Resp'
import { RadiosDao } from '../dao/RadioDao'
// import { RandomCountries, Countries } from '../models/Const'
// import MetaDataStrem from '../util/MetaDataStream'
// import { ObjectId } from 'mongodb'
// import { RemoveDiacritics } from '../util/Diacritics'

class RadioController {
  getGlobeData = async (req, res, next) => {
    try {
      const result = await RadiosDao.getGlobeData()
      res.send(new Resp(false, '', result))
    } catch (err) {
      next(err)
    }
  }

  getRadioById = async (req, res, next) => {
    try {
      const id = req.params.id
      const result = await RadiosDao.getRadioById(id)
      res.send(new Resp(false, '', result))
    } catch (err) {
      next(err)
    }
  }

  getRadiosByPlace = async (req, res, next) => {
    try {
      const _id = req.params.id
      const result = await RadiosDao.getRadiosByPlace(_id)
      const resp = new Resp(false, '', result.radios)
      resp.nearby = result.nearby
      res.send(resp)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  getRadiosByPlaceURL = async (req, res, next) => {
    try {
      const url = req.query.url
      const result = await RadiosDao.getRadiosByPlaceURL(url)
      const resp = new Resp(false, '', result.radios)
      resp.nearby = result.nearby
      res.send(resp)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  getRadioByUrl = async (req, res, next) => {
    try {
      const url = req.query.url
      const result = await RadiosDao.getRadioByUrl(url)
      const resp = new Resp(false, '', result.radio)
      resp.nearby = result.nearby
      res.send(resp)
    } catch (err) {
      next(err)
    }
  }

  getIndexRadios = async (req, res, next) => {
    try {
      const result = await RadiosDao.getIndexRadios()
      res.send(new Resp(false, '', result))
    } catch (err) {
      next(err)
    }
  }

  getNearByRadios = async (req, res, next) => {
    try {
      await db.connect(Collection.PLACES)
      const geo = req.body
      const result = await RadiosDao.getNearbyRadios(geo)
      res.send(new Resp(false, '', result))
    } catch (err) {
      next(err)
    }
  }

  getNearByCountry = async (req, res, next) => {
    try {
      const geo = req.body
      const result = await RadiosDao.getNearbyCountries(geo)
      res.send(new Resp(false, '', result))
    } catch (err) {
      next(err)
    }
  }

  likeRadioById = async (req, res, next) => {
    try {
      const id = req.params.id
      const likes = await RadiosDao.likeRadioById(id)
      res.send(new Resp(false, '', likes))
    } catch (err) {
      next(err)
    }
  }

  searchRadioPlace = async (req, res, next) => {
    try {
      const param = req.query.p
      const result = await RadiosDao.searchRadioPlace(param)
      res.send(new Resp(false, '', result))
    } catch (err) {
      next(err)
    }
  }
}

export default RadioController
