import * as pluralize from 'pluralize'

import { generateTypes } from './types'
import { generatePaths } from './paths'
import { generateSelectors } from './selectors'
import { generateActions } from './actions'
import { generateSagas } from './sagas'
import { generateReducer } from './reducer'

import { BoxModel, InputOptions, Options } from '../index'
import { generateRoutes } from './routes'

/**
 * Generates all the metadata state that any Model will need. This allows
 * programmers to worry less about the Redux action types, action creators,
 * reducers, URL paths, and selectors. By eliminating code repetition, this
 * generation of metadata reduces human error.
 */
export default function generate(input: InputOptions): BoxModel {
  const options: Options = {
    ...input,
    pluralModelName: input.pluralModelName || pluralize(input.modelName),
    entitiesSelector: input.entitiesSelector || ((state) => state.models),
  }

  const { modelName, pluralModelName } = options
  const paths = generatePaths(options)
  const routes = generateRoutes(options)
  const selectors = generateSelectors(options)
  const types = generateTypes(options)

  const actions = generateActions(types)
  const reducer = generateReducer(types)
  const sagas = generateSagas(options, types)

  return {
    $$isBoxModel: true,
    actions,
    modelName,
    paths,
    pluralModelName,
    reducer,
    routes,
    sagas,
    selectors,
    types,
  }
}
