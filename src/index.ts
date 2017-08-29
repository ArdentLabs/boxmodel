import * as pluralize from 'pluralize'

import { generateTypes } from './types'
import { generatePaths } from './paths'
import { generateSelectors } from './selectors'
import { generateActions } from './actions'
import { generateReducer } from './reducer'

import { BoxModel, Schema, Options } from '../index'
import { generateRoutes } from './routes'

/**
 * Generates all the metadata state that any Model will need. This allows
 * programmers to worry less about the Redux action types, action creators,
 * reducers, URL paths, and selectors. By eliminating code repetition, this
 * generation of metadata reduces human error.
 */
export default function generate(
  // The name of the model (in SINGULAR form).
  modelName: string,
  // The normalizr schema object that will be used for normalizing the result
  // from the API response.
  schema: Schema,
  // Pass optional parameters
  options: Options = {},): BoxModel {
  if (!modelName || typeof modelName !== 'string') {
    throw new TypeError('`modelName` has to be a string')
  }
  const pluralModelName = pluralize(modelName)

  const modelId = `${modelName}Id`

  const types = generateTypes(modelName)
  const actions = generateActions(modelName, types, schema)
  const paths = generatePaths(modelName, pluralModelName, modelId)
  const reducer = generateReducer(modelName, types)
  const routes = generateRoutes(modelName, pluralModelName)
  const selectors = generateSelectors(modelName)

  return {
    actions,
    modelName,
    modelId,
    paths,
    reducer,
    selectors,
    schema,
    types,
    $$isBoxModel: true,
  }
}
