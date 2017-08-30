import entitiesReducer from './entitiesReducer'

import { generateTypes } from './types'
import { generatePaths } from './paths'
import { generateSelectors } from './selectors'
import { generateActions } from './actions'
import { generateSagas } from './sagas'
import { generateReducer } from './reducer'

import { BoxModelOptions, Box, InputOptions, Options, EntitiesReducer } from '../index'
import { generateRouteFactory } from './routes'

export default class BoxModel {
  public reducer: EntitiesReducer
  private options: BoxModelOptions

  constructor(options: BoxModelOptions) {
    this.options = options
    this.reducer = entitiesReducer

    this.generate = this.generate.bind(this)
  }

  /**
   * Generates all the metadata state that any Model will need. This allows
   * programmers to worry less about the Redux action types, action creators,
   * reducers, URL paths, and selectors. By eliminating code repetition, this
   * generation of model metadata reduces human error and maintainence.
   */
  public generate<Model>(input: InputOptions): Box<Model> {
    const options: Options = {
      ...this.options,
      entitiesSelector: this.options.entitiesSelector || ((state) => state.models),
      ...input,
    }

    const { modelName } = options
    const paths = generatePaths(options)
    const routes = generateRouteFactory(options)
    const selectors = generateSelectors<Model>(options)
    const types = generateTypes(options)

    const actions = generateActions<Model>(types)
    const reducer = generateReducer(types)
    const sagas = generateSagas(options, types)

    return {
      $$isBoxModel: true,
      actions,
      modelName,
      paths,
      reducer,
      routes,
      sagas,
      selectors,
      types,
    }
  }
}
