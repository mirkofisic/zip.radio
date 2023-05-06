import Collection from '../models/Collection'
import { MongoServerError } from 'mongodb'
import Util from '../util/Util'
class ReadableError {
  constructor() {
    this.util = new Util()
    this.message = new Map()
    this.message.set('11000_' + Collection.USERS, 'server.info.reg.duplicate.user')
  }

  convert = async (err) => {
    let error = null
    if (err instanceof MongoServerError) {
      if (err.code == '11000') {
        if (err.message.includes(Collection.USERS)) {
          error = new ApplicationError(this.message.get(err.code + '_' + Collection.USERS))
        }
      }
    }
    if (error !== null) {
      return await this.util.getErrorReadable(error)
    }
    return err
  }
}

class ApplicationError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.message = message
    this.statusCode = 500
    for (const [key, value] of Object.entries(options)) {
      this[key] = value
    }
  }

  get name() {
    return this.constructor.name
  }
}

class ClientError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.message = message
    for (const [key, value] of Object.entries(options)) {
      this[key] = value
    }
    if (options.response !== undefined) {
      this.statusCode = options.response.status
      if (options.response.data !== undefined) {
        this.message = options.response.data.message
      }
    }
  }

  get name() {
    return this.constructor.name
  }
}

class DatabaseError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.message = message
    for (const [key, value] of Object.entries(options)) {
      this[key] = value
    }
  }

  get statusCode() {
    return 500
  }

  get name() {
    return this.constructor.name
  }
}

class FileManagerError extends Error {
  constructor(message, options = {}) {
    super(message)
    for (const [key, value] of Object.entries(options)) {
      this[key] = value
    }
  }

  get name() {
    return this.constructor.name
  }

  get statusCode() {
    return 500
  }
}

class AuthError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.message = message
    for (const [key, value] of Object.entries(options)) {
      this[key] = value
    }
    this.type = 'AuthError'
  }

  get name() {
    return this.constructor.name
  }

  get statusCode() {
    return 401
  }
}

export default ApplicationError
export { DatabaseError, FileManagerError, AuthError, ApplicationError, ClientError, ReadableError }
