import { ActionMap, Options, Types } from '../index'

export const namespace = '@@boxmodel'

const createActionFactory = (modelName: string) => (operation: string): ActionMap => {
  const prefix = modelName.toUpperCase()
  return {
    request: `${namespace}/${prefix}_${operation}`,
    ok: `${namespace}/${prefix}_${operation}_OK`,
    fail: `${namespace}/${prefix}_${operation}_FAIL`,
  }
}

export function generateTypes(options: Options): Types {
  const factory = createActionFactory(options.modelName)

  const get = factory('GET')
  const fetch = factory('FETCH')
  const create = factory('CREATE')
  const update = factory('UPDATE')
  const archive = factory('ARCHIVE')

  return { get, fetch, create, update, archive }
}
