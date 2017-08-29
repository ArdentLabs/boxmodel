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

export type PathGenerator = (id: string) => string

export interface Paths {
  create: PathGenerator  // Path to create a new model.
  edit: PathGenerator    // Path to edit an existing model.
  fetch: PathGenerator   // Path to view a list of existing models.
  get: PathGenerator     // Path to view an existing model.
  reorder: PathGenerator // Path to reorder existing models
}

export interface Selectors<EntityType> {
  getId: (_: any, props: Props) => string
  getLoading: (state: any) => boolean
  getEntities: (state: any) => {
      [id: string]: EntityType
  }
  getModel: (state: any) => EntityType
}

export interface ActionPayload {
  id?: string
  params?: any
  message?: string
  filters?: any
  sorts?: any
  values?: any
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

export interface Sagas {
}

export type Routes = Partial<RouteProps>[]

export interface BoxModel<EntityType> {
  $$isBoxModel: true
  actions: Actions
  modelName: string
  paths: Paths
  pluralModelName: string
  reducer: Reducer
  routes: Routes
  sagas: Sagas
  selectors: Selectors<EntityType>
  types: Types
}

export interface InputOptions {
  // Singularized, camelCase name for the model.
  modelName: string

  // Plural, camelCase name for the model.
  pluralModelName?: string

  // Normalizr schema used for normalizing the result from the GraphQL server.
  schema: Schema

  // URL of the GraphQL server you want to talk to.
  apiUrl: string

  // GraphQL fields you wish to use in your application.
  fields: string
}

export interface Options extends InputOptions {
  // Plural, camelCase name for the model.
  pluralModelName: string
}
