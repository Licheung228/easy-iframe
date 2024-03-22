import { Superior } from '../../../../'

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

export default superior
