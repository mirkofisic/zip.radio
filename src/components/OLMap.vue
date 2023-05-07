<template>
  <div id="olMapView" class="row full-width full-height"></div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useRadioStore } from '../stores/radiostore'
import { ref } from 'vue'
import useEventBus from 'src/compositions/useEvent'
// OL imports
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
import Pointer from 'ol/interaction/Pointer'


const $q = useQuasar()
const radioStore = useRadioStore()
const points = []
const olMap = ref(null)

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
    if (ev.dragging) { return }
    const coordinate = olMap.value.getEventCoordinate(ev.originalEvent)
    console.log(coordinate)
    let closeFeature = vectorSource.getClosestFeatureToCoordinate(coordinate)
    console.log(closeFeature)
    let closeDistance = Infinity
    olMap.value.forEachFeatureAtPixel(ev.pixel, (feature) => {
      const geometry = feature.getGeometry()
      const distance = geometry.getClosestPoint(ev.pixel)[1]
      console.log(distance)
      if (distance < closeDistance) {
        closeFeature = feature
        closeDistance = distance
      }
    })
    if (closeFeature) {
      const marker = closeFeature.get('marker')
      console.log(marker)
      radioStore.getRadiosByPlace(marker.position._id)
    }
  }

  olMap.value.on('click', onClickMap)
  // olMap.value.on('singleclick', onClickMap)
  var selectPointerMove = new Pointer({
    handleEvent: function(ev) {
      if (ev.type == 'pointermove' && ev && ev.originalEvent && !ev.dragging && ev.originalEvent instanceof TouchEvent) {
        const coordinate = olMap.value.getEventCoordinate(ev.originalEvent)
        // console.log(coordinate)
        let closeFeature = vectorSource.getClosestFeatureToCoordinate(coordinate);
        // console.log(closeFeature)
        if (closeFeature) {
          const marker = closeFeature.get('marker')
          // console.log(marker)
          radioStore.getRadiosByPlace(marker.position._id)
        }
      }
      return true
    }
  })

  if ($q.platform.is.mobile) olMap.value.addInteraction(selectPointerMove)
}

useEventBus.on('GlobeData', async() => {
  setUpOpenLayers()
})

</script>
