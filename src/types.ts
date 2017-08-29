import { ActionTuple, Options, Types } from '../index'

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

export function generateTypes(options: Options): Types {
  const factory = createActionFactory(options.modelName)

  const get = factory('GET')
  const fetch = factory('FETCH')
  const create = factory('CREATE')
  const update = factory('UPDATE')
  const archive = factory('ARCHIVE')

  return { get, fetch, create, update, archive }
}
