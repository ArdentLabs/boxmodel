// Type definitions for boxmodel v1.0.0
// Project: boxmodel
// Definitions by: Sam Balana <sam.balana@ardentacademy.com>

import { schema } from 'normalizr'
import { RouteProps } from 'react-router'

export type Schema = schema.Entity

export type ActionTuple = [string, string, string]

export interface Types {
  get: ActionTuple
  fetch: ActionTuple
  create: ActionTuple
  update: ActionTuple
  archive: ActionTuple
}

export interface Params {
  [param: string]: string
}

export type PathFactory = (params: object) => string

export interface Paths {
  create: string  // Path to create a new model.
  edit: string    // Path to edit an existing model.
  fetch: string   // Path to view a list of existing models.
  get: string     // Path to view an existing model.
  reorder: string // Path to reorder existing models
}

export interface Selectors {
}

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

export type Routes = Array<Partial<RouteProps>>

export interface BoxModel {
  actions: Actions
  modelId: string
  modelName: string
  paths: Paths
  pluralModelName: string
  reducer: Reducer
  routes: Routes
  schema: Schema
  selectors: Selectors
  types: Types
  $$isBoxModel: true
}

export interface Options {
}
