import { Notify } from 'quasar'
class Notification {
  constructor() {
    this.successOpts = {
      message: '',
      type: 'positive',
      position: 'top',
    }
  }

  info = async (message) => {
    const opts = {
      message: message,
      type: 'positive',
      position: 'top',
    }
    Notify.create(opts)
  }

  error = async (message) => {
    const opts = {
      message: message,
      type: 'negative',
      position: 'top',
    }
    Notify.create(opts)
  }

  warn = async (message) => {
    const opts = {
      message: message,
      type: 'warning',
      position: 'top',
    }
    Notify.create(opts)
  }
}

const useNotify = new Notification()
export default useNotify
