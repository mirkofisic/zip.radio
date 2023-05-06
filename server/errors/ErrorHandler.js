import Util from '../util/Util'
import { MongoServerError } from 'mongodb'
import { Logger } from '../log/Logger'
import { ReadableError, DatabaseError, FileManagerError, AuthError, ApplicationError } from './BaseErrors'
class ErrorHandler {
  static setup = async (app) => {
    this.util = new Util()
    this.readableError = new ReadableError()
    app.use(this.ErrorHandling)
  }

  static ErrorHandling = async (err, req, res, next) => {
    if (res.status === undefined) {
      next()
    } else {
      if (err instanceof DatabaseError || err instanceof FileManagerError || err instanceof AuthError || err instanceof ApplicationError) {
        res.status(err.statusCode).send(await this.util.getErrorReadable(err))
      } else if (err instanceof MongoServerError) {
        res.status(500).send(await this.readableError.convert(err))
      } else {
        res.status(510).send(await this.util.getErrorReadable(err))
      }
    }
    Logger.error(err)
  }
}

export default ErrorHandler
