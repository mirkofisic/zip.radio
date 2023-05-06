/* eslint-disable no-useless-constructor */
class Radio {
  constructor () {
    this._id = ''
    this.href = ''
    this.title = ''
    this.placeId = ''
    this.id = ''
    this.url = ''
    this.website = ''
    this.secure = false
    this.place = {
      id: '',
      title: ''
    }
    this.country = {
      id: '',
      title: ''
    }
    this.stream = ''
    this.verified = true
    this.errMessage = ''
    this.likes = 0
    this.visits = 0
  }
}
export default Radio
