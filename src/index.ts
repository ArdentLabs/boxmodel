import { generateTypes } from './types'
import { generatePaths } from './paths'
import { generateSelectors } from './selectors'
import { generateActions } from './actions'
import { generateSagas } from './sagas'
import { generateReducer } from './reducer'

import { BoxModel, Schema, Options } from '../index'

/**
 * Generates all the metadata state that any Model will need. This allows
 * programmers to worry less about the Redux action types, action creators,
 * reducers, URL paths, and selectors. By eliminating code repetition, this
 * generation of metadata reduces human error.
 */
export default function generate(options: Options): BoxModel {
  if (!modelName || typeof modelName !== 'string') {
    throw new TypeError('`modelName` has to be a string')
  }

  const modelId = `${modelName}Id`

  const types = generateTypes(options)
  const paths = generatePaths(options, modelId)
  const actions = generateActions(options, types)
  const sagas = generateSagas(options, types)

  const reducer = generateReducer(options, types)
  const selectors = generateSelectors(options)

  return {
    $$isBoxModel: true,
    actions,
    modelId,
    modelName,
    paths,
    reducer,
    sagas,
    schema,
    selectors,
    types,
  }
}
