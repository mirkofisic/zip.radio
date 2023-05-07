<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <Suspense>
  <q-page class="flex" style="overflow: hidden; max-height:  calc(100vh - 55px); height: calc(100vh - 55px);">
    <div class="row absolute-top-left q-pa-md full-height" style="z-index: 1;">
      <div class="col-3 full-height" style="min-width: 390px;">
        <q-card class="full-height">
          <q-card-section class="q-pa-xs">
            <q-toolbar class="q-pa-xs">
              <q-select
                filled
                v-model="searchModel"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                :options="searchOptions"
                option-label="title"
                option-value="_id"
                @filter="filterFn"
                dropdown-icon="search"
                class="full-width"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" :to="scope.opt.url">
                    <q-item-section avatar>
                      <q-icon :name="scope.opt.icon" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.title }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.country }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-toolbar>
            <q-toolbar q-pa-xs>
              <q-btn v-show="!useStreamRadio.data.playing" flat stretch round dense class="q-mr-xs" color="blue-grey-6" size="30px" icon="play_circle_filled" @click="useStreamRadio.play(radioStore.radio)" />
              <q-btn v-show="useStreamRadio.data.playing" :loading="useStreamRadio.data.loading" flat stretch round dense class="q-mr-sm" color="blue-grey-6" size="30px" icon="pause" @click="useStreamRadio.stop" />
              <!-- <q-toolbar-title v-html="useStreamRadio.radioPageTitle" style="padding-top: 10px;"></q-toolbar-title> -->
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label :key="'label1'">{{ radioStore.radioTitle }}</q-item-label>
                    <q-item-label caption :key="'label2'">{{ radioStore.radioPlace + ' - ' + radioStore.radioCountry  }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-space></q-space>
              <q-btn flat round stretch dense :color="isFavorite ? 'green' : 'blue-grey-6'" size="15px" icon="favorite" @click="radioStore.addToFavorites" />
              <q-btn flat round stretch dense color="blue-grey-6" size="15px" icon="share" />
              <!-- <q-btn flat round stretch dense color="blue-grey-6" size="15px" icon="travel_explore" /> -->
            </q-toolbar>
          </q-card-section>
          <q-card-section v-if="isFavorites || isRecent"><div class="text-h5">{{ isFavorites ? 'Favorites' : 'Recent' }}</div></q-card-section>
          <q-card-section v-if="isFavorites || isRecent" class="q-pa-xs">
            <q-scroll-area class="full-width" :style="'height:' + fullHeight + 'px;'">
              <div class="row">
                <q-list class="full-width">
                  <EssentialLink v-for="radio in isFavorites ? radioStore.pageIndex.favorites : radioStore.pageIndex.recent" :key="radio._id" :radio="radio"/>
                </q-list>
              </div>
            </q-scroll-area>
          </q-card-section>
          <q-card-section v-if="!isFavorites && !isRecent"><div class="text-h5">Radios</div></q-card-section>
          <q-card-section v-if="!isFavorites && !isRecent" class="q-pa-xs">
            <q-scroll-area class="full-width" :style="'height:' + height + 'px;'">
              <div class="row">
                <q-list class="full-width">
                  <EssentialLink v-for="radio in radioStore.pageIndex.radios" :key="radio._id" :radio="radio"/>
                </q-list>
              </div>
            </q-scroll-area>
          </q-card-section>
          <q-card-section v-if="!isFavorites && !isRecent"><div class="text-h5">Nerbay Places</div></q-card-section>
          <q-card-section v-if="!isFavorites && !isRecent" class="q-pa-xs">
            <q-scroll-area class="full-width" :style="'height:' + height + 'px;'">
              <div class="row">
                <q-list class="full-width">
                  <EssentialLink v-for="place in radioStore.pageIndex.places" :key="place._id" :place="place"/>
                </q-list>
              </div>
            </q-scroll-area>
          </q-card-section>
          <q-resize-observer @resize="onResize" />
        </q-card>
      </div>
    </div>
    <q-no-ssr style="width: 100%; height: 100%;">
      <!-- <div id="olMapView" class="row full-width full-height"></div> -->
      <!-- <OLMap></OLMap> -->
    </q-no-ssr>
  </q-page>
  </Suspense>
</template>


<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useMeta } from 'quasar'
import { useRadioStore } from '../stores/radiostore'
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import useStreamRadio from 'src/compositions/StreamRadio'
import EssentialLink from 'src/components/EssentialLink.vue'

/*const OLMap = defineAsyncComponent(() =>
  import('src/components/OLMap.vue')
)*/
// import OLMap from 'src/components/OLMap.vue'
// OL imports
/*
import Feature from 'ol/Feature.js'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
// import TileLayer from 'ol/layer/WebGLTile.js';
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import BingMaps from 'ol/source/BingMaps.js'
import XYZ from 'ol/source/XYZ'
// import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js'
import {Point} from 'ol/geom.js'
import {fromLonLat} from 'ol/proj'
import WebGLTileLayer from 'ol/layer/WebGLTile.js'
import { FeatureStyles } from 'src/compositions/models/styles'
*/

import DataTypes from 'src/compositions/util/DataTypes'
import useEventBus from 'src/compositions/useEvent'

const route = useRoute()
const radioStore = useRadioStore()
const points = []
const olMap = ref(null)
const height = ref(500)
const fullHeight = ref(500)
const searchOptions = ref([])
const searchModel = ref(null)
const dth = new DataTypes()
const isRecent = ref(false)
const isFavorites = ref(false)


useEventBus.on('main-menu', async(ev) => {
  if (ev.url.includes('favorites')) { isRecent.value = false; isFavorites.value = true }
  if (ev.url.includes('recent')) { isRecent.value = true; isFavorites.value = false }
  if (ev.url.includes('map')) { isRecent.value = false; isFavorites.value = false }
})

const filterFn = async (val, update, abort) => {
  console.log(val)
  if (val.length < 2) {
    abort()
    return
  }
  update(async () => {
    searchOptions.value = []
    const searchResult = await radioStore.searchRadioPlace(val)
    for(let i = 0; i < searchResult.length; ++i) {
      const rp = searchResult[i]
      rp.icon = dth.isString(rp.country) ? 'location_on' : 'img:/icons/zip_radio_place.svg'
      rp.country = dth.isString(rp.country) ? rp.country : rp.country.title
      searchOptions.value.push(rp)
    }
  })
}

const isFavorite = computed(() => {
  const exist = radioStore.pageIndex.favorites.find(r => r._id === radioStore.radio._id)
  if (exist) return true
  return false
})

const onResize = async(size) => {
  console.log('onResizeObserver', size)
  height.value = Math.floor(size.height/3)
  fullHeight.value = Math.floor(size.height - 220)
}
/*
const setUpOpenLayers = async () => {
  // setup points
  // console.log('total markers', radioStore.map.markers.length)
  for (let i = 0; i < radioStore.map.markers.length; ++i) {
    const marker = radioStore.map.markers[i]
    // console.log(marker.position)
    const feature = new Feature({
      'geometry': new Point(fromLonLat([marker.position.lng, marker.position.lat])), //new Point([marker.position.lng, marker.position.lat]),
      'i': i,
      'size': marker.position.total > 10 ? 3 : 1,
      'name': 'Test' + i
    })
    feature.set('marker', marker, true)
    points[i] = feature
  }

  const vectorSource = new VectorSource({
      features: points,
      wrapX: false,
  })

  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: function (feature) {
      const zoom = Math.floor(olMap.value.getView().getZoom())
      const marker = feature.get('marker')
      if (zoom >= 5 && zoom < 7) {
        if (marker.position.total > 10) {
          return FeatureStyles[2]
        } else {
          return FeatureStyles[0]
        }
      }
      if (zoom >= 6 && zoom < 8)  {
        if (marker.position.total > 10) {
          return FeatureStyles[3]
        } else {
          return FeatureStyles[1]
        }
      }
      if (zoom >= 8)  {
        if (marker.position.total > 10) {
          return FeatureStyles[4]
        } else {
          return FeatureStyles[2]
        }
      }
      if (marker.position.total > 10) {
        return FeatureStyles[2]
      } else {
        return FeatureStyles[0]
      }
    },
  })

  const variables = {
    brightness: 0.70,
    exposure: 0,
    contrast: .50,
    saturation: 0,
  }

  const bingLayer = new WebGLTileLayer({
    preload: Infinity,
    style: {
      exposure: ['var', 'exposure'],
      contrast: ['var', 'contrast'],
      saturation: ['var', 'saturation'],
      variables: variables,
    },
    source: new BingMaps({
      key: 'ApPutgihdauNgbJakJLwpsgPpsYDMkIWY7_rd0hi191x7m0OpdV1rukH2Yxr5lH8',
      imagerySet: 'Aerial', // set the type of imagery you want to use, such as Road, Aerial, or AerialWithLabels
    })
  })

  const openStreetLayer = new TileLayer({
    source: new XYZ({
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    })
  })

  olMap.value = new Map({
    target: 'olMapView',
    renderer: 'webgl',
    layers: [
      bingLayer,
      vectorLayer,
    ],
    view: new View({
      center: fromLonLat([10.2551, 50.5260]),
      zoom: 5,
      maxZoom: 9,
      constrainOnlyCenter: true,
    })
  })

  const onClickMap = async (ev) => {
    console.log('click on map', ev)
    const feature = olMap.value.forEachFeatureAtPixel(ev.pixel, (feature) => feature)
    if (feature) {
      const marker = feature.get('marker')
      console.log(marker)
      radioStore.getRadiosByPlace(marker.position._id)
    }
  }

  olMap.value.on('click', onClickMap)
}
*/

useMeta(() => {
  return {
    title: radioStore.metaData.title
  }
})


const getDeepPathsNumber = async (path) => {
  const deepPathsNumber = path.split('/').length-1
  return deepPathsNumber
}

const onChangeRoute = async(to, from) => {
  // console.log(to.path, route.path)
  try {
    isRecent.value = false
    isFavorites.value = false
    const deepPathsNumber = await getDeepPathsNumber(route.path)
    if (deepPathsNumber >= 3) radioStore.getRadioByURL(route.path, true, true, false)
    if (deepPathsNumber === 2) radioStore.getRadiosByPlaceURL(route.path)
  } catch(err) {
    console.log(err)
  }
}
watch(route, onChangeRoute)

if (import.meta.env.SSR) {
  if (route.path === '' || route.path === '/') {
    await radioStore.loadIndexData()
  } else {
    const deepPathsNumber = await getDeepPathsNumber(route.path)
    if (deepPathsNumber >= 3) await radioStore.getRadioByURL(route.path, true, false, true)
    if (deepPathsNumber === 2) await radioStore.getRadiosByPlaceURL(route.path)
    if (deepPathsNumber < 2) {
      await radioStore.loadIndexData()
    }
  }
} else {
  radioStore.loadFavorites()
}

onMounted(async () => {
  console.log('onMounted')
  await radioStore.loadGlobeData()
  // setUpOpenLayers()
})

onBeforeMount(async () => {
  console.log('onBeforeMount', route.path)
})


</script>

<style>
.ol-overlaycontainer-stopevent {
  display: none;
}

</style>
