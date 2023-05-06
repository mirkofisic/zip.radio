import Collection from '../models/Collection'
import DataTypes from '../util/DataTypes'

const LogLevels = {
  DEBUG: 'debug',
  ERROR: 'error',
  TRACE: 'trace',
  INFO: 'info',
}
class Log {
  constructor() {
    this.LOGS = null
    this.levels = process.env.LOG_LEVELS
    this.dth = new DataTypes()
  }

  injectDb = async (mongoClient) => {
    this.levels = process.env.LOG_LEVELS
    this.LOGS = await mongoClient.db(process.env.DB_NAME).collection(Collection.LOGS)
  }

  error = async (err) => {
    if (!this.levels.includes(LogLevels.ERROR)) return
    err.level = LogLevels.ERROR
    this.#insertError(err)
  }

  debug = async (err) => {
    if (!this.levels.includes(LogLevels.DEBUG)) return
    err.level = LogLevels.DEBUG
    this.#insertError(err)
  }

  trace = async (err) => {
    if (!this.levels.includes(LogLevels.TRACE)) return
    err.level = LogLevels.TRACE
    this.#insertError(err)
  }

  info = async (err) => {
    if (!this.levels.includes(LogLevels.INFO)) return
    err.level = LogLevels.INFO
    this.#insertError(err)
  }

  #insertError = async (err) => {
    err.errorClass = !this.dth.isNullOrUndefined(err.constructor) ? err.constructor.name : 'UknownError'
    err.stackTrace = err.stack
    err.created_at = new Date()
    if (process.env.NODE_ENV === 'production') {
      await this.LOGS.insertOne(err)
    } else {
      console.log(err)
    }
  }
}

const Logger = new Log()
export { Logger, LogLevels }
