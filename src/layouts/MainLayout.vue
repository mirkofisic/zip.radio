<template>
  <Suspense>
  <q-layout view="lHh Lpr lFf">
    <q-drawer v-model="leftDrawerOpen" bordered persistent side="left" :mini="mini">
      <q-list padding>
        <q-item clickable v-ripple @click="toggleLeftDrawer">
          <q-item-section avatar>
            <q-icon name="menu" />
          </q-item-section>
          <q-item-section></q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-ripple @click="useEventBus.emit('main-menu', { url: '/favorites' })">
          <q-item-section avatar>
            <q-icon name="bookmark" />
          </q-item-section>
          <q-item-section>Favorites</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-ripple @click="useEventBus.emit('main-menu', { url: '/recent' })">
          <q-item-section avatar>
            <q-icon name="schedule" />
          </q-item-section>
          <q-item-section>Recent</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-ripple  @click="useEventBus.emit('main-menu', { url: '/map' })">
          <q-item-section avatar>
            <q-icon name="public" />
          </q-item-section>
          <q-item-section>Radio Map</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-ripple @click="openFullScreen">
          <q-item-section avatar>
            <q-icon name="fullscreen" />
          </q-item-section>
          <q-item-section>Full Screen</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- <q-footer>
      <q-toolbar>
        <q-space/>
        <q-btn flat dense round icon="fullscreen" aria-label="Menu" @click="openFullScreen"/>
      </q-toolbar>
    </q-footer> -->
  </q-layout>
  </Suspense>
</template>

<script setup>
import { useQuasar, EventBus } from 'quasar'
import useEventBus from 'src/compositions/useEvent'
import { ref } from 'vue'
// import EssentialLink from 'src/components/EssentialLink.vue'
import { useRadioStore } from 'src/stores/radiostore'
const $q = useQuasar()
const radioStore = useRadioStore()
const mini = ref(true)
const leftDrawerOpen = ref(true)

const toggleLeftDrawer = async () => {
  mini.value = !mini.value
}

const openFullScreen = async() => {
  console.log($q.fullscreen.isCapable)
  if ($q.fullscreen.isActive) {
    $q.fullscreen.exit()
  } else {
    $q.fullscreen.request()
  }
}
</script>
