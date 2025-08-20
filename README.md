easy-iframe2
<a href="https://www.licuii.xyz">
  <img
    src="http://cdn.licuii.xyz/self/lic-icon.png"
    alt="lic-logo"
    width="50"
  />
  <b>Create-Lik-App</b>
</a>

# Usage

## MainAPP

construct a mian app instance

### **constructor**

#### `src`

iframe src, and will be used targetOrigin of postMessage

#### `onError`

error callback

## SubAPP

### constructor

#### `targetOrigin`

the main app origin

optional, default is `"*"`, will be used targetOrigin of postMessage

if not set or set to `"*"`, the sub app will accept any origin from main app

#### `onError`

error callback

## Methods

### `init`

`init` connenct with sub app by polling. all other actions should after `init` complete.

`init` accept two params:

- iframe container <HTMLElement>
- connenct polling options <Object>

  - `interval` - polling interval
  - `maxAttempts` - maximum attempts times of polling connect
  - `timeout` - time limit of polling connect
  - `query` - query string of iframe src

every handler should after `init` complete. you can use `DEFAULT_MESSAGE_TYPE.CONNECTED` to listen connect complete.

### `postMessage`

emit another app's event, accept one param <Message>

be like:

```ts
/* in main app */
const main = new MainAPP({ src: 'http://subapp.com' })
// iframe src is http://subapp.com?id=123
main.init(document.querySelector('#iframeContainer'), { interval: 1000, query: { id: '123' } })
// postMessage to emit 'count_change' event of sub app
main.postMessage({ type: 'count_change', payload: 123 })

/* in sub app */
const sub = new SubAPP({ targetOrigin: 'mainapp.com' })
sub.init()
sub.on('count_change', (e) => {
  document.querySelector('count').innerText = e
})
```

### `on`

for register event, two params

- event name <string>
- listener <Function>

## MainAPP Default event

- `CONNECTING` trigger when every polling time
- `CONNECTED` trigger when connected

# Example

## create MainAPP

here is a app powered by vue

```js
<script setup lang="ts">
import { MainAPP, DEFAULT_MESSAGE_TYPE } from 'easy-iframe'
import { onMounted, ref } from 'vue'

// iframe's contianer
const iframeContainerRef = ref<HTMLElement>()
// create a instance of main app
const main = new MainAPP({
  src: 'http://localhost:5174'
})
// loading when iframe connecting
const loading = ref(true)
// callback when iframe connected
const onConnected = () => {
  console.log('>>> iframe connected')
  loading.value = false
}
onMounted(() => {
  // listen to connected event (default event) when connected success will emit and then off
  main.on(DEFAULT_MESSAGE_TYPE.CONNECTED, onConnected)
  // init the easy-iframe, to connect sub app
  main.init(iframeContainerRef.value!, {
    interval: 1000,
    maxAttempts: 4
  })
})
// send message to sub app
const add = () => {
  // use postMessage to emit sub app event
  main.postMessage!({ type: 'add' })
}
</script>

<template>
  <div>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <button @click="add">send to sub app</button>
    <!-- must be v-show or use style display: none, make sure the element is in the dom -->
    <div v-show="loading" class="loading">loading...</div>
    <div
      v-show="!loading"
      ref="iframeContainerRef"
      style="margin-top: 10px"
    ></div>
  </div>
</template>

<style scoped></style>
```

## create SubAPP

here is a app powered by react

```ts
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import { SubAPP } from 'easy-iframe'
// create sub app instance
const sub = new SubAPP({
  targetOrigin: 'http://localhost:5173',
  // listen error
  onError: e => console.error(e)
})

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // init sub app, wait for main app init
    sub.init()
    // listen add event
    sub.on('add', () => {
      setCount(count => count + 1)
    })

    return () => sub.clear('add')
  }, [])

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
```

# Type declarations

**Message**

```ts
interface Message<T = string, P = any> {
  type: T
  payload: P
}
```
