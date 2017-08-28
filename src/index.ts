import { generateTypes } from './types'
import { generatePaths } from './paths'
import { generateSelectors } from './selectors'
import { generateActions } from './actions'
import { generateReducer } from './reducer'
import { parseParent } from './utils'

import { BoxModel, Schema, Options } from '../index'

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
  options: Options = {},
): BoxModel {
  if (!modelName || typeof modelName !== 'string') {
    throw new TypeError('`modelName` has to be a string')
  }

  const modelId = `${modelName}Id`
  const parent = parseParent(options.parent)

  const types = generateTypes(modelName)
  const paths = generatePaths(modelName, modelId, parent)
  const selectors = generateSelectors(modelName, parent)
  const actions = generateActions(modelName, types, schema)
  const reducer = generateReducer(modelName, types)

  return {
    modelName,
    modelId,
    schema,
    parent,
    types,
    paths,
    selectors,
    actions,
    reducer,
    $$isBoxModel: true,
  }
}
