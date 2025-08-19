<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
// import mainApp from './utils/iframe'
import { DEFAULT_MESSAGE_TYPE } from '../../../'
import { MainAPP } from '../../../'

const mainApp = new MainAPP({
  src: 'http://localhost:8220',
  onError: (err) => {
    console.log(err)
  },
})

const loading = ref(true)
const iframeContainerRef = ref()

onMounted(async () => {
  mainApp.on(DEFAULT_MESSAGE_TYPE.CONNECTED, () => {
    loading.value = false
    console.log(mainApp.targetOrigin)
  })
  mainApp.on(DEFAULT_MESSAGE_TYPE.CONNECTING, () => {
    console.log('connecting...')
  })
  mainApp.init(iframeContainerRef.value, {
    interval: 1000,
    maxAttempts: 5,
  })
})

const switchSubFavorite = () => {
  mainApp.postMessage?.({
    type: 'switch',
    payload: true,
  })
}
</script>

<template>
  <div>
    <div v-show="loading">loading...</div>
    <div
      ref="iframeContainerRef"
      :style="{
        width: '80vw',
        height: '80vh',
        display: loading ? 'none' : 'block',
      }"
    ></div>
  </div>

  <button style="margin-top: 10px" @click="switchSubFavorite">
    change sub favorite
  </button>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
