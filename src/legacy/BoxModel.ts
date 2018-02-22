import * as React from 'react'
import { combineReducers } from 'redux'
import { Selector } from 'reselect'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { generateActions } from './actions'
import { generatePaths } from './paths'
import { generateReducer, ModelReducer, ModelState, ModelAction } from './reducer'
import { generateRoutes, Route } from './routes'
import { generateSaga, Saga } from './sagas'
import { generateSelectors } from './selectors'
import { generateTypes } from './types'

import { Box } from './box'
import { Model } from './Model'

export type ModelsReducer = (state: ModelsState, action: ModelAction<any>) => ModelsState

export interface ModelsState {
  [modelName: string]: ModelState<any>
}

export interface BoxMap {
  [modelName: string]: Box<any>
}

export interface ReducerMap {
  [modelName: string]: ModelReducer<any>
}

export type ModelsSelector = Selector<any, ModelsState>

export interface BoxModelOptions {
  // All the schemas for the models you want a box for.
  schemas: Model[]

  // URL of the GraphQL server you want to talk to.
  apiUrl: string

  // Selects the Redux state of the reducer exposed by boxmodel.
  selector: ModelsSelector
}

function toTitle(camelCase: string): string {
  const words = camelCase.split(/(?=[A-Z])/)
  words[0] = words[0].substr(0, 1).toUpperCase() + words[0].substr(1)
  return words.join(' ')
}

export class BoxModel {
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

    this.reducer = combineReducers(this.reducers as any)
  }

  public withBox(schema: Model) {
    const box = this.boxes[schema.key]
    return (element: React.ReactElement<any>) => React.cloneElement(element, { box })
  }

  /**
   * Generates all the metadata state that any Model will need. This allows
   * programmers to worry less about the Redux action types, action creators,
   * reducers, URL paths, and selectors. By eliminating code repetition, this
   * generation of model metadata reduces human error and maintainence.
   */
  private generate(schema: Model) {
    const { key, components } = schema

    const types = generateTypes(key)
    const actions = generateActions<any>(types)
    const selectors = generateSelectors<any>(key, this.modelsSelector)
    const paths = generatePaths(key)
    const box: Box<any> = {
      $$isBoxModel: true,
      actions,
      modelName: key,
      modelTitle: toTitle(key),
      paths,
      selectors,
      types,
    }

    this.boxes[key] = box
    this.reducers[key] = persistReducer({
      key: `boxmodel-${key}`,
      storage,
      whitelist: ['sort', 'filter', 'page']
    }, generateReducer(types) as any)
    this.sagas.push(generateSaga(schema, types, selectors, this.options.apiUrl))
    this.routes.push(...generateRoutes(key, components, box))
  }
}
