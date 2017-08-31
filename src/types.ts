import { ActionMap, Types } from '../index'

export const namespace = '@@boxmodel'

const createActionFactory = (modelName: string) => (operation: string): ActionMap => {
  const prefix = modelName.toUpperCase()
  return {
    request: `${namespace}/${prefix}_${operation}`,
    ok: `${namespace}/${prefix}_${operation}_OK`,
    fail: `${namespace}/${prefix}_${operation}_FAIL`,
  }
}

export function getMergeType(modelName: string) {
  const prefix = modelName.toUpperCase()
  return `${namespace}/${prefix}_MERGE`
}

export function generateTypes(modelName: string): Types {
  const factory = createActionFactory(modelName)

  const get = factory('GET')
  const fetch = factory('FETCH')
  const create = factory('CREATE')
  const update = factory('UPDATE')
  const archive = factory('ARCHIVE')
  const merge = getMergeType(modelName)

  return { get, fetch, create, update, archive, merge }
}
