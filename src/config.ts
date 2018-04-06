export interface Config {
  apiUrl: string
}

export const config: Config = {
  apiUrl: ''
}

export const configure = (cfg: Partial<Config>) => {
  Object.assign(config, cfg)
}
