/* eslint-disable no-useless-constructor */
import { ObjectId } from 'bson'
class DataTypes {
  constructor () { }

  isObjectId (value) {
    return value && typeof value === typeof ObjectId && value.constructor === ObjectId
  }

  // Returns if a value is an object
  isObject (value) {
    return value && typeof value === 'object' && value.constructor === Object
  }

  // Returns if a value is null
  isNull (value) {
    return value === null
  }

  // Returns if a value is undefined
  isUndefined (value) {
    return typeof value === 'undefined'
  }

  // Returns if a value is a boolean
  isBoolean (value) {
    return typeof value === 'boolean'
  }

  // Returns if a value is a regexp
  isRegExp (value) {
    return value && typeof value === 'object' && value.constructor === RegExp
  }

  // Returns if value is an error object
  isError (value) {
    return value instanceof Error && typeof value.message !== 'undefined'
  }

  // Returns if value is a date object
  isDate (value) {
    return value instanceof Date
  }

  // Returns if a Symbol
  isSymbol (value) {
    return typeof value === 'symbol'
  }

  // Returns if a value is really a number
  isNumber (value) {
    return typeof value === 'number' && isFinite(value)
  }

  // Returns if a value is an array
  isArray (value) {
    return Array.isArray(value)
    // return value && typeof value === 'object' && value.constructor === Array;
  }

  // Returns if a value is a function
  isFunction (value) {
    return typeof value === 'function'
  }

  // Returns if a value is a string
  isString (value) {
    return typeof value === 'string' || value instanceof String
  }

  isColumnType (value) {
    if (this.isNumber(value) || this.isString(value) || this.isBoolean(value)) return true
    return false
  }

  isTableType (value) {
    if (this.isObject(value) || this.isArray(value)) return true
    return false
  }

  isStringNullOrEmpty (value) {
    if (value === null || value === undefined) return true
    value = value.trim()
    return !value
  }

  isNullOrUndefined (value) {
    if (value === null || value === undefined) return true
    return false
  }

  isArrayValidTable (arr) {
    return arr.every((e) => {
      const iso = this.isObject(e)
      return iso
    })
  }
}

export default DataTypes
