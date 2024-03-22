<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Superior } from '../../../../'

const container = ref<HTMLDivElement>()
const fromSon = ref('')

// 实例化
const superior = new Superior({
  targetOrigin: 'http://localhost:5173',
  query: {
    token: 123
  },
  onError: (error: unknown) => {
    console.log('%cMark🔸>>>', 'color: red;', 'error', error)
  }
})

// 初始化
superior.frame.width = '100%'
superior.frame.height = '100%'
superior.init().then(() => {
  console.log('%cMark🔸>>>', 'color: red;', 'init', 'init successed')
})

// 监听 子传父
superior.subscribe('xixihaha', (payload: any) => {
  console.log('%cMark🔸>>>', 'color: red;', 'event:from son', payload)
  fromSon.value = payload
})

// 父传子
const setSrc = () => {
  superior.setSrc({ query: { token: false } })
}

// 模拟路由
let n = 0
const sendEvent = () => {
  superior.send('changeBool', Boolean(++n % 2 === 0))
}

// 未知属性
const unknowtype = () => superior.send('xiba', '123')

// 卸载
const unmout = () => {
  superior.unmount()
}

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
    <button @click="setSrc">changeSrc</button>
    <button @click="sendEvent">changeWithEvent</button>
    <button @click="unmout">unmount father</button>
    <button @click="unknowtype">unknow type</button>
  </main>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
