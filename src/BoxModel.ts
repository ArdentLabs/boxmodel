import { GQLQuerier } from './typings'

export interface BoxModelOptions {
  /**
   * A function that is called with a graphql query string and returns a Promise that contains the response data.
   * See documentation for `GQLQuerier` for details.
   */
  query: GQLQuerier
  /**
   * Selects the state that BoxModel will be operating on.
   * Defaults to `state => state.boxmodel`.
   */
  selector: (state: any) => any // TODO type output
  /** An array of all models that this boxmodel should handle. */
  models: string[]
  /** Namespace of boxmodel actions. Defaults to `@@boxmodel`. */
  namespace: string
}

export default class BoxModel {
  private options: BoxModelOptions

  constructor(options: Partial<BoxModelOptions>) {
    this.options = {
      query: async () => ({ data: {} }),
      selector: (state: any) => state.boxmodel,
      models: [],
      namespace: '@@boxmodel',
      ...options,
    }
  }
}
