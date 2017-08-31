// Type definitions for boxmodel v1.0.0
// Project: boxmodel
// Definitions by: Sam Balana <sam.balana@ardentacademy.com>

import { schema } from 'normalizr'
import { match } from 'react-router'
import { RouterState } from 'react-router-redux'

export class ModelSchema extends schema.Entity {
  constructor(key: string, definition?: Schema, options?: schema.EntityOptions)
  public mount(components: ModelComponents): void
  public components: ModelComponents
}

export interface ModelComponents {
  Table: any
  Create: any
  Reorder: any
  Edit: any
  Detail: any
}

export default class BoxModel {
  constructor(options: BoxModelOptions)
  private generate<Model>(schema: ModelSchema): Box<Model>
}

export interface BoxModelOptions {
  // All the schemas for the models you want a box for.
  schemas: ModelSchema[]

  // URL of the GraphQL server you want to talk to.
  apiUrl: string

  // Selects the entities reducer exposed by boxmodel.
  entitiesSelector?: EntitiesSelector
}

export interface Box<Model> {
  $$isBoxModel: true
  actions: Actions<Model>
  modelName: string
  paths: Paths
  selectors: Selectors<Model>
  types: Types
}

export interface BoxMap {
  [modelName: string]: Box<any>
}

export interface Actions<Model> {
  get: (id: string, fields: string) => Action
  fetch: (fields: string, options?: FetchOptions) => Action
  create: (data: Model, fields: string) => Action
  update: (id: string, data: Partial<Model>, fields: string) => Action
  archive: (id: string, fields?: string) => Action
}

export interface Action {
  type: string
  payload: ActionPayload
}

export interface ActionPayload {
  id?: string
  params?: any
  message?: string
  filters?: any
  sorts?: any
  values?: any
  variables?: any

  // GraphQL fields you wish to use in your application.
  fields?: any
}

export interface FetchOptions {
  filter?: Filters
  sort?: Sorts
  page?: Pagination
}

export interface Filters {
  [filter: string]: number | Filters
}

export interface Sorts {
  [field: string]: Boolean | Sorts
}

export interface Pagination {
  // Skip a number of results from the beginning of the query.
  skip: number

  // Limit the query to return only a number of results.
  limit: number
}

export type PathGenerator = (id: string) => string

export interface Paths {
  create: PathGenerator  // Path to create a new model.
  edit: PathGenerator    // Path to edit an existing model.
  fetch: PathGenerator   // Path to view a list of existing models.
  get: PathGenerator     // Path to view an existing model.
  reorder: PathGenerator // Path to reorder existing models
}

export type Reducer = (state: ModelState, action: Action) => ModelState

export interface ReducerMap {
  [modelName: string]: Reducer
}

export interface ModelState {
  result: string[],
  loading: boolean,
  error: string | null,
}

export type Schema = schema.Entity

export type RouteFactory = (components: ModelComponents) => Route[]

export interface Route {
  path: string,
  component: any,
}

export type Routes = Route[]

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

export interface Selectors<Model> {
  id: any
  loading: any
  model: any
  models: any
  filters: any
}

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

export interface State {
  entities?: EntitiesState
  router?: RouterState
  [modelTitle: string]: any
}

interface EntitiesState {
  [modelType: string]: ModelEntities<any>
}

interface ModelEntities<Model> {
  [id: string]: Model
}

export interface EntitiesAction extends Action {
  type: string
  payload: {
    entities: EntitiesState
    entityKey?: string
    id?: string
  }
}

export type EntitiesReducer = (state: EntitiesState, action: EntitiesAction) => EntitiesState
export type EntitiesSelector = (state: any) => EntitiesState
