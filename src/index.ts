import { cloneElement, ReactElement } from 'react'
import { combineReducers } from 'redux'

import { generateTypes } from './types'
import { generatePaths } from './paths'
import { generateSelectors } from './selectors'
import { generateActions } from './actions'
import { generateSaga } from './sagas'
import { generateReducer } from './reducer'

import {
  ModelSchema, BoxModelOptions, ReducerMap, Route, Saga, Box, BoxMap, ModelsReducer,
  ModelsSelector,
} from '../index'
import { generateRoutes } from './routes'

export { default as Model } from './Model'

export default class BoxModel {
  public reducer: ModelsReducer
  public routes: Route[]
  public sagas: Saga[]
  private reducers: ReducerMap
  private boxes: BoxMap
  private options: BoxModelOptions
  private modelsSelector: ModelsSelector

  constructor(options: BoxModelOptions) {
    this.options = options
    this.modelsSelector = options.selector

    this.reducers = {}
    this.routes = []
    this.sagas = []
    this.boxes = {}

    this.generate = this.generate.bind(this)
    this.withBox = this.withBox.bind(this)

    options.schemas.map(this.generate)

    this.reducer = combineReducers(this.reducers)
  }

  public withBox(schema: ModelSchema) {
    const box = this.boxes[schema.key]
    return (element: ReactElement<any>) => cloneElement(element, { box })
  }

  /**
   * Generates all the metadata state that any Model will need. This allows
   * programmers to worry less about the Redux action types, action creators,
   * reducers, URL paths, and selectors. By eliminating code repetition, this
   * generation of model metadata reduces human error and maintainence.
   */
  private generate(schema: ModelSchema) {
    const { key, components } = schema

    const types = generateTypes(key)
    const actions = generateActions<any>(types)
    const selectors = generateSelectors<any>(key, this.modelsSelector)
    const paths = generatePaths(key)
    const box: Box<any> = {
      $$isBoxModel: true,
      actions,
      modelName: key,
      paths,
      selectors,
      types,
    }

    this.boxes[key] = box
    this.reducers[key] = generateReducer(types)
    this.sagas.push(generateSaga(schema, types, this.options.apiUrl))
    this.routes.push(...generateRoutes(key, components, box))
  }
}
