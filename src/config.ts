export interface Config {
  fetch: (input: string | Request, init?: RequestInit) => Promise<Response>;
  apiUrl: string;
}

export const config: Config = {
  fetch,
  apiUrl: ''
}

export const configure = (cfg: Partial<Config>) => {
  Object.assign(config, cfg)
}
