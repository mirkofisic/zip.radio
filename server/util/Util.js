import { MongoServerError } from 'mongodb'
import Resp from '../models/Resp'

class Util {
  getErrorReadable = async (err, filterOut = []) => {
    const resp = new Resp(true)
    const obj = {}
    Object.getOwnPropertyNames(err).forEach(function (key) {
      if (key === 'message') {
        resp.Message = err[key]
      } else if (key === 'type') {
        resp.type = err[key]
      } else {
        if (!filterOut.includes(key)) obj[key] = err[key]
      }
    })
    resp.data = obj
    return resp
  }
}

export default Util
