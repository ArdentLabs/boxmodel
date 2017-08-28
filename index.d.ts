// Type definitions for boxmodel v1.0.0
// Project: boxmodel
// Definitions by: Sam Balana <sam.balana@ardentacademy.com>

import { schema } from 'normalizr'
import { Reducer } from 'redux'

export type Schema = schema.Entity

export type ActionTuple = [string, string, string]
export interface Types {
  get: ActionTuple
  fetch: ActionTuple
  create: ActionTuple
  update: ActionTuple
  search: ActionTuple
  reorder: ActionTuple
  destroy: ActionTuple
}

export interface Params { [param: string]: string }
export type PathFactory = (params: Params) => string
export type Path = string | PathFactory
export interface Paths {
  fetch: PathFactory,   // Path to view a list of existing models.
  create: PathFactory,  // Path to create a new model.
  get: PathFactory,     // Path to view an existing model.
  edit: PathFactory,    // Path to edit an existing model.
  reorder: PathFactory, // Path to reorder the submodels of an existing model.
}

export interface Selectors {}
export interface Actions {}
export interface State {}

export interface BoxModel {
  modelName: string
  modelId: string
  schema: Schema
  parent: BoxModel
  types: Types
  paths: Paths
  selectors: Selectors
  actions: Actions
  reducer: Reducer<State>
  $$isBoxModel: true
}

export interface Options {
  parent?: BoxModel
}
