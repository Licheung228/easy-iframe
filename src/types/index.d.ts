type task = (payload: any, type?: any) => any

interface constructorParamsSuperior {
  targetOrigin: string
  typeList?: string[]
  onError?: (err: any) => void
  query?: Record<string, any>
}

interface constructorParamsSurboridinate {
  targetOrigin: string
  typeList?: string[]
  onError?: (err: any) => any
}

interface constructorParamsMitt {
  typeList?: constructorParamsSuperior['typeList']
  onError?: constructorParamsSuperior['onError']
  origin: constructorParamsSuperior['targetOrigin']
}
