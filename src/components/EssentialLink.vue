<template>
  <q-item clickable :active="active" tag="a" :to="(props.radio) ? props.radio.url : props.place.url">
    <q-item-section avatar>
      <q-icon :name="(props.radio) ? 'img:/icons/zip_radio_place.svg' : 'location_on'" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ (props.radio) ? props.radio.title : props.place.title + ' ('+ props.place.total +')' }}</q-item-label>
      <q-item-label v-if="props.radio" caption>{{ props.radio.place.title }} - {{ props.radio.country.title }}</q-item-label>
      <q-item-label v-if="props.place" caption>{{ props.place.country }}</q-item-label>
    </q-item-section>
  </q-item>
  <q-separator />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
const props = defineProps({
  radio: null,
  place: null
})
// const active = ref(false)
const route = useRoute()
const active = computed(() => {
  const path = (props.radio) ? props.radio.url : props.place.url
  return route.path === path
})
/* const onChangeRoute = async(to, from) => {
  const path = (props.radio) ? props.radio.url : props.place.url
  if (route.path === path) {
    active.value = true
  } else {
    active.value = false
  }
}
if (!process) {
  watch(route, onChangeRoute)
} */
</script>
