// Type definitions for boxmodel v1.0.0
// Project: boxmodel
// Definitions by: Sam Balana <sam.balana@ardentacademy.com>

import { schema } from 'normalizr'
import { RouteProps, match } from 'react-router'
import { RouterState } from 'react-router-redux'

export type Schema = schema.Entity

export interface ActionMap {
  request: string
  ok: string
  fail: string
}

export interface Types {
  get: ActionMap
  fetch: ActionMap
  create: ActionMap
  update: ActionMap
  archive: ActionMap
}

export type PathGenerator = (id: string) => string

export interface Paths {
  create: PathGenerator  // Path to create a new model.
  edit: PathGenerator    // Path to edit an existing model.
  fetch: PathGenerator   // Path to view a list of existing models.
  get: PathGenerator     // Path to view an existing model.
  reorder: PathGenerator // Path to reorder existing models
}

export interface Filters {
  [filter: string]: any
}

export interface Selectors<Model> {
  id: any
  loading: any
  model: any
  models: any
  filters: (state: any, props: any) => Filters
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

export interface Actions<Model> {
  get: (id: string) => Action
  fetch: () => Action
  create: (data: Model) => Action
  update: (id: string, data: Partial<Model>) => Action
  archive: (id: string) => Action
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

export type TransformFunc<Model> = (model: Model) => any

export type SortFunc<Model> = (a: Model, b: Model, state: any) => boolean

export interface Params {
  id?: string
  parentId?: string
  parentModel?: string
}

export interface Props<Model> {
  id?: string
  match: match<Params>
  model?: Model
  joinWith?: JoinWith
  transform?: TransformFunc<Model> | TransformFunc<Model>[]
  filters?: Filters,
  sortBy: SortFunc<Model>,
}

export type Selector<Model> = (state: any, props: Props<Model>) => any

export interface Sagas {
}

export type Routes = Partial<RouteProps>[]

export interface BoxModel<Model> {
  $$isBoxModel: true
  actions: Actions<Model>
  modelName: string
  paths: Paths
  pluralModelName: string
  reducer: Reducer
  routes: Routes
  sagas: Sagas
  selectors: Selectors<Model>
  types: Types
}

interface EntitiesState {
  [modelType: string]: ModelEntities<any>
}

interface ModelEntities<Model> {
  [id: string]: Model
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

  // Selects the entities reducer exposed by boxmodel.
  entitiesSelector?: (state: any) => EntitiesState
}

export interface Options extends InputOptions {
  // Plural, camelCase name for the model.
  pluralModelName: string

  // Selects the entities reducer exposed by boxmodel.
  entitiesSelector: (state: any) => EntitiesState
}

export interface State {
  entities?: EntitiesState
  router?: RouterState
  [modelTitle: string]: any
}
