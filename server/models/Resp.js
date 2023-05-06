class Resp {
  constructor (_error = false, _message = '', _data = null) {
    this.error = _error
    this.message = _message
    this.data = _data
  }

  get Error () {
    return this.error
  }

  set Error (val) {
    this.error = val
  }

  get Message () {
    return this.message
  }

  set Message (val) {
    this.message = val
  }

  get Data () {
    return this.data
  }

  set Data (val) {
    this.data = val
  }
}

export default Resp
