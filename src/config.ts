import { BoxModelState } from './redux/reducer'

export interface Config {
  /** The API URL, <b>without</b> `/graphql`. Defaults to empty string. */
  apiUrl: string
  /** Selector used to select boxmodel state. Defaults to selecting `state.boxmodel`. */
  selector: (state: any) => BoxModelState
  /** Namespace of boxmodel actions. Defaults to `@@boxmodel`. */
  namespace: string
  /** Function used to transform the id prop when normalizing. Defaults to appending 'Id' at the end. */
  transformId: (field: string) => string
}

const defaultConfig: Config = {
  apiUrl: '',
  selector: (state) => state.boxmodel,
  namespace: '@@boxmodel',
  transformId: (field) => field + 'Id'
}

export const config: Config = { ...defaultConfig }

export const configure = (cfg: Partial<Config>) => {
  Object.assign(config, cfg)
}

export const reset = () => {
  configure(defaultConfig)
}
