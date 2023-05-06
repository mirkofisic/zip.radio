<template>
  <q-page class="flex flex-center">
    {{ radioStore.pageIndex.radios.length }}
  </q-page>
</template>

<script setup>
// import { useMeta } from 'quasar'
import { useRadioStore } from 'src/stores/radiostore'
const radioStore = useRadioStore()
radioStore.loadIndexData()
// useMeta(radioStore.metaData)
</script>
