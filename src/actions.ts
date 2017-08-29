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
  const get = (id: string) => ({
    type: getRequest(types.get),
    payload: { id },
  })

  const fetch = () => ({
    type: getRequest(types.fetch),
    payload: {},
  })

  const create = (values: any) => ({
    type: getRequest(types.create),
    payload: { values },
  })

  const update = (id: string, values: any) => ({
    type: getRequest(types.update),
    payload: { id, values },
  })

  const archive = (id: string) => ({
    type: getRequest(types.archive),
    payload: { id },
  })

  return { get, fetch, create, update, archive }
}
