import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js'
const fillColor = '#00FF82'
const strokeColor = '#00FF82'
const fill = new Fill({ color: fillColor })
const stroke = new Stroke({ color: strokeColor, width: 1 })
export const FeatureStyles = [
  new Style({
    image: new CircleStyle({
      radius: 1,
      fill: fill,
      stroke: stroke,
    }),
  }),
  new Style({
    image: new CircleStyle({
      radius: 2,
      fill: fill,
      stroke: stroke,
    }),
  }),
  new Style({
    image: new CircleStyle({
      radius: 3,
      fill: fill,
      stroke: stroke,
    }),
  }),
  new Style({
    image: new CircleStyle({
      radius: 4,
      fill: fill,
      stroke: stroke,
    }),
  }),
  new Style({
    image: new CircleStyle({
      radius: 5,
      fill: fill,
      stroke: stroke,
    }),
  }),
  new Style({
    image: new CircleStyle({
      radius: 6,
      fill: fill,
      stroke: stroke,
    }),
  }),
  new Style({
    image: new CircleStyle({
      radius: 7,
      fill: fill,
      stroke: stroke,
    }),
  }),
  new Style({
    image: new CircleStyle({
      radius: 8,
      fill: fill,
      stroke: stroke,
    }),
  }),
  new Style({
    image: new CircleStyle({
      radius: 9,
      fill: fill,
      stroke: stroke,
    }),
  }),
]
