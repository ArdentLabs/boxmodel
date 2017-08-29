import * as pluralize from 'pluralize'

import { generateTypes } from './types'
import { generatePaths } from './paths'
import { generateSelectors } from './selectors'
import { generateActions } from './actions'
import { generateSagas } from './sagas'
import { generateReducer } from './reducer'

import { BoxModel, Options } from '../index'
import { generateRoutes } from './routes'

/**
 * Generates all the metadata state that any Model will need. This allows
 * programmers to worry less about the Redux action types, action creators,
 * reducers, URL paths, and selectors. By eliminating code repetition, this
 * generation of metadata reduces human error.
 */
export default function generate(options: Options): BoxModel {
  if (!options.pluralModelName) {
    options.pluralModelName = pluralize(options.modelName)
  }

  const { modelName, pluralModelName } = options
  const types = generateTypes(options)

  const actions = generateActions(types)
  const paths = generatePaths(options)
  const reducer = generateReducer(types)
  const routes = generateRoutes(options)
  const sagas = generateSagas(options, types)
  const selectors = generateSelectors(options)

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
