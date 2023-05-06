import axios from 'axios'
import { reactive, computed } from 'vue'

class StreamRadio {
  constructor() {
    this.radio = null
    this.interval = 4000
    this.timeOut = null
    this.type = ''
    this.audio = null
    this.data = reactive({
      title: '',
      playing: false,
      loading: false,
      radio: null,
    })
  }

  radioPageTitle = computed(() => {
    let title = ''
    if (this.data.radio !== null) {
      title = `<h1>${this.data.radio.title}</h1>
          <h3>${this.data.radio.place.title} - ${this.data.radio.country.title}</h3>`
    }
    return title
  })

  getMetaData = async () => {
    // check if its icecast or shoutcast
    const resp = await axios.get('/api/radio/scrap?stream=' + this.radio.stream)
    console.log(resp)
    this.data.title = resp.data.data
  }

  play = async (radio) => {
    await this.stop()
    console.log('play', radio, radio.stream)
    this.radio = radio
    this.data.radio = radio
    if (this.audio === null) {
      this.audio = new Audio(this.radio.stream)
    } else {
      this.audio.src = this.radio.stream
    }
    this.audio.onplaying = (ev) => {
      // console.log('onplayinng', ev)
      this.data.loading = false
    }
    this.audio.onload = (ev) => {
      this.data.loading = false
    }
    this.audio.onerror = (ev) => {
      // console.log('Error Audio', ev)
    }
    this.data.loading = true
    this.audio.load()
    this.audio.play()
    this.data.playing = true
    // this.getMetaData()
  }

  stop = async () => {
    if (this.timeOut !== null) {
      clearTimeout(this.timeOut)
      this.timeOut = null
    }
    if (this.audio !== null) {
      this.audio.pause()
    }
    this.data.playing = false
    this.data.loading = false
  }
}
const useStreamRadio = new StreamRadio()
export default useStreamRadio
