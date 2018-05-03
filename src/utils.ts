// Some internal utility functions.

import debounce = require('lodash.debounce')
import { Store } from 'redux'
import { format } from 'prettier'

import { config } from './config'
import { BoxModelState } from './redux'

/**
 * Sends a GraphQL query to the api server and returns the result.
 * This function does not modify the GraphQL string.
 */
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

/**
 * Template string tag for GraphQL queries.
 * In the development environment, the tagged string is formatted using prettier.
 * Outside the development environment, the tagged string is shortened to decrease request size.
 */
export const q = (template: TemplateStringsArray, ...insertions: any[]) => {
  const result = String.raw({ ...template, raw: template }, ...insertions)

  if (process.env.NODE_ENV !== 'development') {
    return result.trim().replace(/\s+/g, ' ')
  }
  else {
    return format(result, { parser: 'graphql' })
  }
}

type ModelFunction<T> = (modelName: string) => T

/**
 * Specialized memoizer for functions that take only the model name as parameter.
 */
export const memoize = <T>(callable: ModelFunction<T>): ModelFunction<T> => {
  const cache: { [modelName: string]: T } = {}

  return (modelName) => {
    if (!(modelName in cache)) {
      cache[modelName] = callable(modelName)
    }

    return cache[modelName]
  }
}

/**
 * A selector function that changes what it returns when configured.
 * Used for creating selectors, as passing `config.selector` does not account for configuration changes.
 */
export const selector = (state: any): BoxModelState => config.selector(state)

/**
 * Testing utility function for waiting for the store to stop changing.
 *
 * @param store The redux store
 * @param delay Maximum number of milliseconds to wait between successive updates
 */
export const finalState = async <S>(store: Store<S>, delay: number = 500): Promise<S> => new Promise<S>((resolve) => {
  const unsubscribe = store.subscribe(debounce(() => {
    unsubscribe()
    resolve(store.getState())
  }, delay))
})
