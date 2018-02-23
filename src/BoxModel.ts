import { GraphQLResponseData } from './typings'

export interface BoxModelOptions {
  // A function that is called with a graphql query string and returns a Promise that contains the response data.
  // Should look like (query, variables) => fetch(graphqlUrl, { body: JSON.stringify({ query, variables }) }).then(response => response.json())
  query: (query: string, variables?: object) => Promise<GraphQLResponseData>
  // Selects the state that BoxModel will be operating on.
  // Defaults to (state) => state.boxmodel
  selector: (state: object) => object
  // The models that this boxmodel should handle
  models: string[]
  // Namespace of boxmodel actions. Defaults to `@@boxmodel`
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
