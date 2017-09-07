import { Types } from './types'
import { Actions } from './actions'

export interface Filters {
  [filter: string]: number | Filters
}

export interface Sorts {
  [field: string]: boolean | Sorts
}

export interface Pagination {
  // Skip a number of results from the beginning of the query.
  skip: number

  // Limit the query to return only a number of results.
  limit: number
}

export interface FetchOptions {
  filter?: Filters
  sort?: Sorts
  page?: Pagination
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

export interface Entities<Model> {
  [modelName: string]: {
    [id: string]: Model
  }
}

export interface Action {
  type: string
  payload: ActionPayload
}

export interface Actions<Model> {
  get: (id: string, fields: string) => {
    type: string
    payload: {
      id: string
      fields: string
    }
  }
  fetch: (fields: string, options?: FetchOptions) => {
    type: string
    payload: {
      fields: string
      variables: any
    }
  }
  create: (values: Model, fields: string) => {
    type: string
    payload: {
      values: Model,
      fields: string
    }
  }
  update: (id: string, values: any, fields: string) => {
    type: string
    payload: {
      id: string
      values: any
      fields: string
    }
  }
  archive: (id: string, fields: string) => {
    type: string
    payload: {
      id: string
      fields: string
    }
  }
}

/**
 * Generates an object of Redux action creators for utilization in generic
 * viewing components such as ModelViewer.
 *
 * This way of systematically generating common actions will be useful to when
 * attempting to close the gap between client and server code.
 *
 * @return
 *         (get, fetch, create, search, update, reorder, and destroy)
 */
export function generateActions<Model>(types: Types): Actions<Model> {
  const get = (id: string, fields: string) => ({
    type: types.get.request,
    payload: { id, fields },
  })

  const fetch = (fields: string, options?: FetchOptions) => ({
    type: types.fetch.request,
    payload: { fields, variables: options },
  })

  const create = (values: Model, fields: string) => ({
    type: types.create.request,
    payload: { values, fields },
  })

  const update = (id: string, values: any, fields: string) => ({
    type: types.update.request,
    payload: { id, values, fields },
  })

  const archive = (id: string, fields: string) => ({
    type: types.archive.request,
    payload: { id, fields },
  })

  return { get, fetch, create, update, archive }
}

/**
 * This action type will be dispatched by the history actions below.
 * If you're writing a middleware to watch for navigation events, be sure to
 * look for actions of this type.
 */
export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD'

function updateLocation(method: string) {
  return (...args: any[]) => ({
    type: CALL_HISTORY_METHOD,
    payload: { method, args }
  })
}

/**
 * These actions correspond to the history API.
 * The associated routerMiddleware will capture these events before they get to
 * your reducer and reissue them as the matching function on your history.
 */
export const push = updateLocation('push')
export const replace = updateLocation('replace')
export const go = updateLocation('go')
export const goBack = updateLocation('goBack')
export const goForward = updateLocation('goForward')

export const routerActions = { push, replace, go, goBack, goForward }
