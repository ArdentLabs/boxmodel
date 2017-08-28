import { ActionTuple, Types } from '../index'

const createActionFactory = (modelName: string) => (operation: string): ActionTuple => {
  const prefix = modelName.toUpperCase()
  return [
    `${prefix}_${operation}`,
    `${prefix}_${operation}_OK`,
    `${prefix}_${operation}_FAIL`,
  ]
}

export const getRequest = (actions: ActionTuple) => actions[0]
export const getOk = (actions: ActionTuple) => actions[1]
export const getFail = (actions: ActionTuple) => actions[2]

export function generateTypes(modelName: string): Types {
  const factory = createActionFactory(modelName)

  const get = factory('GET')
  const fetch = factory('FETCH')
  const create = factory('CREATE')
  const update = factory('UPDATE')
  const search = factory('SEARCH')
  const reorder = factory('REORDER')
  const destroy = factory('DESTROY')

  return { get, fetch, create, update, search, reorder, destroy }
}
