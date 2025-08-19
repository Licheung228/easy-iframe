import { SubAPP } from '../../../../../'

export const subApp = new SubAPP({
  targetOrigin: 'http://127.0.0.1:5173',
  onError(err) {
    console.log('sub app error >>> ', err)
  },
})
