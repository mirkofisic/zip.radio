/* eslint-disable no-useless-constructor */
import { format, parseISO } from 'date-fns'

class DateHelper {
  constructor () { }
  parseISODate = (strDate, returnFormat = null) => {
    const date = parseISO(strDate)
    if (returnFormat === null) return date
    return this.formatDate(date, returnFormat)
  }

  formatDate = (date, returnFormat) => {
    return format(date, returnFormat)
  }
}

export default DateHelper
