import { generateTypes } from './types'
import { generatePaths } from './paths'
import { generateSelectors } from './selectors'
import { generateActions } from './actions'
import { generateReducer } from './reducer'
import { parseParent } from './utils'

import { schema } from 'normalizr'
import { Reducer } from 'redux'

export interface Types {}
export interface Paths {}
export interface Selectors {}
export interface Actions {}
export interface State {}

export interface BoxModel {
  model: string
  modelId: string
  schema: schema.Entity
  parent: BoxModel
  types: Types
  paths: Object
  selectors: Selectors
  actions: Actions
  reducer: Reducer<State>
  $$isBoxModel: true
}

export interface Options {
  parent: BoxModel
}

export function generate(modelName: string, schema: schema.Entity, options: Options) {

}
