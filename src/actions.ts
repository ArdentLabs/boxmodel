import { Types, Actions, Params } from '../index'
import { getRequest } from './types'

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
export function generateActions(types: Types): Actions {
  const get = (id: string, params: Params) => ({
    type: getRequest(types.get),
    payload: { id, params },
  })

  const fetch = (params: Params) => ({
    type: getRequest(types.fetch),
    payload: { params },
  })

  const create = (data: any, params: Params) => ({
    type: getRequest(types.create),
    payload: { data, params },
  })

  const update = (id: string, data: any, params: Params) => ({
    type: getRequest(types.update),
    payload: { id, data, params },
  })

  const archive = (id: string, params: Params) => ({
    type: getRequest(types.archive),
    payload: { id, params },
  })

  return { get, fetch, create, update, archive }
}
