// Type definitions for boxmodel v1.0.0
// Project: boxmodel
// Definitions by: Sam Balana <sam.balana@ardentacademy.com>

import { Schema } from 'normalizr'
import { Reducer } from 'redux'

export interface Types {}
export interface Paths {}
export interface Selectors {}
export interface Actions {}
export interface State {}

export interface BoxModel {
  model: string
  modelId: string
  schema: Schema
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
