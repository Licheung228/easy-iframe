<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Superior } from '../../../'

const container = ref<HTMLDivElement>()
const fromSon = ref('')

// 实例化
const superior = new Superior({
  targetOrigin: 'http://localhost:5173',
  query: {
    token: 123
  },
  onError: error => {
    console.log('%cMark🔸>>>', 'color: red;', error)
  }
})
// 初始化
superior.frame.width = '100%'
superior.frame.height = '100%'
superior.init()
// 监听 子传父
superior.subscribe('xixihaha', (payload: any) => {
  console.log('%cMark🔸>>>', 'color: red;', 'from son', payload)
  fromSon.value = payload
})

onMounted(() => {
  // 放入 dom
  container.value?.append(superior.frame)
})
</script>

<template>
  <header style="margin-bottom: 10px">fromSon：{{ fromSon }}</header>
  <div ref="container" style="height: 100%; width: 100%"></div>
  <main
    style="display: flex; justify-content: space-around; margin-top: 20px"
  >
    <button
      @click="
        () => {
          superior.setSrc({ query: { token: 456 } })
        }
      "
    >
      changeSrc
    </button>
    <button
      @click="
        () => {
          superior.send('changeBool', false)
        }
      "
    >
      changeWithEvent
    </button>
  </main>
</template>

<style scoped></style>
