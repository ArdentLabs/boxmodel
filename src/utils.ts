// Some internal utility functions.

import { config } from './config'
import { BoxModelState } from './redux';

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

// Tag for query to shorten them in
export const q = (template: TemplateStringsArray, ...insertions: any[]) => {
  const result = String.raw({ ...template, raw: template }, ...insertions)

  if (process.env.NODE_ENV !== 'development') {
    return result.trim().replace(/\s+/g, ' ')
  }
  else {
    return result
  }
}

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
