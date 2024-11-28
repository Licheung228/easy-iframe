# easy-iframe

## 简介

用于iframe(跨域)通信的简易工具

## 安装

```bash
npm install @likcheung/easy-iframe
```

## 使用

### 父级

```typescript
const superior = new Superior({
  // 目标源，即 子级 的 window.origin
  targetOrigin: 'http://localhost:5173',
  // 期望拼接的 query 参数
  query: {
    token: '123',
  },
  // 错误处理函数。例如父子断联等情况时会执行。
  onError: (err) => console.log(err),
})

// 初始化，链接的关键。可以在任何时机进行初始化。只要保证在subordinate实例化后和iframe挂载前。
superior.init(/* 此处可以如同 setSrc 一样设置 iframe 的 src */)

// setSrc 可以随时设置 iframe 的 query 或者 hash
superior.setSrc({ query: { token: '456' } }) // http://localhost:5173/?token=123 ==> http://localhost:5173/?token=456

// 向子级发送消息
document.getElementById('btn').addEventListener('click', function () {
  superior.send('hello', 'hello')
})

// 取消监听/卸载
document
  .getElementById('btn-close')
  .addEventListener('click', function () {
    // 取消特定的任务监听
    superior.unsubscribe('hello', fn)
    // 取消整个类型的监听
    superior.unsubscribe('hello')
    // 停止所有监听，停止监听并不会卸载 frame。
    superior.stop()
    // 卸载，停止所有监听，并且卸载 frame。卸载后需要重新 new 才能再次获取 frame
    superior.unmount()
  })
```

### 子级

```typescript
const subordinate = new Subordinate({
  targetOrigin: 'http://localhost:5174',
  onError: (err) => {
    console.log(err)
  },
})
// 初始化
subordinate.init(/* 同setSrc，可以传入query/hash */)

// 开启监听 navi 事件
subordinate.subscribe('hello', (payload: string) => {
  console.log(payload, 'world')
})

// 取消监听/卸载
document
  .getElementById('btn-close')
  .addEventListener('click', function () {
    // 取消特定的任务监听
    subordinate.unsubscribe('hello', fn)
    // 取消整个类型的监听
    subordinate.unsubscribe('hello')
    // 卸载 easy-iframe
    subordinate.unmount()
  })
```

## 注意

**1-链接问题**

- 链接成功时，控制台会出现 `🚀>>> connect success` 的提示。
- 如果没有出现任何提示。则说明父子链接不成功。
- 链接不成功并不影响 `iframe` 的显示。但是事件的注册和监听等无法使用。
- 父子双方其中一方未调用 init 方法，会导致链接不成功，提示语不显示。

**2-targetOrigin 设置时必须要求 父级的`targetOrigin` 和 子级的`window.origin` 全等**

```js
// 如下情况不会链接成功。
// 无法看到  ·🚀>>> connect success· 的打印

// 父级
const superior = new Superior({
  targetOrigin: 'http://localhost:3000',
})

// 子级
console.log(window.origin) // ==>'http://127.0.0.1:3000'
console.log(window.origin) // ==>'http://127.0.0.1:3001'
console.log(window.origin) // ==>'http://127.0.0.1:3000/'

// 反之同理
```

**3-直接通过 `setSrc` 设置 iframe**

时会导致 iframe 重新加载以及 `easy-iframe` 重新链接。建议使用事件系统，在子级监听事件。并更改 `location.href`。详情请看下方。

**4-子传父数据类型为引用类型时导致通信失败**

仅某些情况(较老项目中)会出现这种错误，使用 `JSON.stringify` 即可解决
