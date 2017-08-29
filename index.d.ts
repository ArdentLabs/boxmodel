// Type definitions for boxmodel v1.0.0
// Project: boxmodel
// Definitions by: Sam Balana <sam.balana@ardentacademy.com>

import { schema } from 'normalizr'

export type Schema = schema.Entity

export type ActionTuple = [string, string, string]
export interface Types {
  get: ActionTuple
  fetch: ActionTuple
  create: ActionTuple
  update: ActionTuple
  archive: ActionTuple
}

export interface Params { [param: string]: string }
export type PathFactory = (params: Params) => string
export type Path = string | PathFactory
export interface Paths {
  fetch: string   // Path to view a list of existing models.
  create: string  // Path to create a new model.
  get: string     // Path to view an existing model.
  edit: string    // Path to edit an existing model.
}

export interface Selectors {}

export interface ActionPayload {
  id?: string
  data?: any
  params?: any
  message?: string
}

export interface Action {
  type: string
  payload: ActionPayload
}

export interface Actions {
  get: (id: string, params: Params) => Action
  fetch: (params: Params) => Action
  create: (data: any, params: Params) => Action
  update: (id: string, data: any, params: Params) => Action
  archive: (id: string, params: Params) => Action
}

export interface ModelState {
  result: string[],
  loading: boolean,
  error: string | null,
}

export type Reducer = (state: ModelState, action: Action) => ModelState

export interface JoinWith {
  [modelName: string]: boolean | string | JoinWith
}

export type TransformFunc = (model: any) => any

export interface Filters {
  [filter: string]: any
}

export type SortFunc = (a: any, b: any, state: any) => boolean

export interface Props {
  params?: Params
  model?: any
  joinWith?: JoinWith
  transform?: TransformFunc | TransformFunc[]
  filters?: Filters,
  sortBy: SortFunc,
}

export type Selector = (state: any, props: Props) => any

export interface BoxModel {
  modelName: string
  modelId: string
  schema: Schema
  types: Types
  paths: Paths
  selectors: Selectors
  actions: Actions
  reducer: Reducer
  $$isBoxModel: true
}

export interface Options {
}
