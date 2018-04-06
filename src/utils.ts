// Some internal utility functions.

import { config } from './config'
import { BoxModelState } from './redux/reducer'

export const query = (gqlQuery: string, variables?: any): Promise<{ data: any }> =>
  fetch(config.apiUrl + '/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      query: gqlQuery,
      variables
    })
  })
    .then((response) => response.json())

type ModelFunction<T> = (modelName: string) => T

export const memoize = <T>(callable: ModelFunction<T>): ModelFunction<T> => {
  const cache: { [modelName: string]: T } = {}
  
  return (modelName) => {
    if (!(modelName in cache)) {
      cache[modelName] = callable(modelName)
    }
    
    return cache[modelName]
  }
}

export const selector = (state: any): BoxModelState => config.selector(state)
