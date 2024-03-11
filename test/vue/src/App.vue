<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { Superior } from '../../../'

const container = ref<HTMLDivElement>()
const superior = new Superior({
  targetOrigin: 'http://localhost:5173',
  query: {
    token: 123
  },
  onError: error => {
    console.log('%cMark🔸>>>', 'color: red;', error)
  }
})
superior.init()
superior.subscribe('xixihaha', (payload: any) => {
  console.log('%cMark🔸>>>', 'color: red;', 'from son', payload)
})

onMounted(() => {
  container.value?.append(superior.frame)
  // superior.send('hello', 'Hello')
})
</script>

<template>
  <div ref="container"></div>
  <button
    @click="
      () => {
        superior.setSrc({ query: { token: 456 } })
      }
    "
  >
    change
  </button>
  <button
    @click="
      () => {
        superior.send('changeBool', false)
      }
    "
  >
    changeBool
  </button>
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
