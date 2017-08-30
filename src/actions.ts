import { Types, Actions, FetchOptions } from '../index'

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
  const get = (id: string) => ({
    type: types.get.request,
    payload: { id },
  })

  const fetch = (options?: FetchOptions) => ({
    type: types.fetch.request,
    payload: { variables: options },
  })

  const create = (values: Model) => ({
    type: types.create.request,
    payload: { values },
  })

  const update = (id: string, values: any) => ({
    type: types.update.request,
    payload: { id, values },
  })

  const archive = (id: string) => ({
    type: types.archive.request,
    payload: { id },
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
