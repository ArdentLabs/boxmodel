import { AnyAction } from 'redux'

import { memoize } from '../../utils'
import types from './types'

export interface Join {
  [field: string]: true | Join
}

export interface Actions {
  /** Initialize the model. Should only be called once. */
  init: () => AnyAction
  /** Meta action. Only updates loading state. */
  one: (id: string, join?: Join) => AnyAction
  /** Meta action. Only updates loading state. */
  many: (variables: any, join?: Join) => AnyAction
  /** Meta action. Only updates loading state. */
  create: (values: any, join?: Join) => AnyAction
  /** Meta action. Only updates loading state. */
  update: (id: string, values: any, join?: Join) => AnyAction
  /** Meta action. Only updates loading state. */
  archive: (id: string, join?: Join) => AnyAction
  /** Dispenses data for reducer to cache. */
  merge: (values: any) => AnyAction
}

const actions = (modelName: string): Actions => {
  const init = () => ({
    type: types(modelName).init,
    payload: {
      modelName
    }
  })

  const one = (id: string, join: Join = {}) => ({
    type: types(modelName).one.request,
    payload: {
      id,
      join
    }
  })

  const many = (variables: any, join: Join = {}) => ({
    type: types(modelName).many.request,
    payload: {
      variables,
      join
    }
  })

  const create = (values: any, join: Join = {}) => ({
    type: types(modelName).create.request,
    payload: {
      values,
      join
    }
  })

  const update = (id: string, values: any, join: Join = {}) => ({
    type: types(modelName).update.request,
    payload: {
      id,
      values,
      join
    }
  })

  const archive = (id: string, join: Join = {}) => ({
    type: types(modelName).archive.request,
    payload: {
      id,
      join
    }
  })

  const merge = (values: any) => ({
    type: types(modelName).merge,
    payload: {
      values
    }
  })

  return {
    init,
    one,
    many,
    create,
    update,
    archive,
    merge
  }
}

export default memoize(actions)
