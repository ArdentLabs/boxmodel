import { memoize } from '../utils'
import { AnyAction } from 'redux'
import types, { init } from './types'

export interface Join {
  [fieldName: string]: true | Join
}

export interface Actions {
  // Initializer. Special action.
  init: () => AnyAction
  // Data fetch actions.
  one: (id: string, join?: Join) => AnyAction
  many: (variables: any, join?: Join) => AnyAction
  // Data mutation actions.
  create: (input: any) => AnyAction
  update: (id: string, input: any) => AnyAction
  archive: (id: string) => AnyAction
  // Merge. Special action.
  merge: (data: any) => AnyAction
}

const actions = (modelName: string): Actions => ({
  init: () => ({
    type: init(),
    payload: { modelName }
  }),
  one: (id, join = {}) => ({
    type: types(modelName).one.request,
    payload: { id, join }
  }),
  many: (variables, join = {}) => ({
    type: types(modelName).many.request,
    payload: { variables, join }
  }),
  create: (input) => ({
    type: types(modelName).create.request,
    payload: { input }
  }),
  update: (id, input) => ({
    type: types(modelName).update.request,
    payload: { id, input }
  }),
  archive: (id) => ({
    type: types(modelName).archive.request,
    payload: { id }
  }),
  merge: (data) => ({
    type: types(modelName).merge,
    payload: { data }
  })
})

export default memoize(actions)
