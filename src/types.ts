export interface ActionMap {
  request: string
  ok: string
  fail: string
}

export interface Types {
  get: ActionMap
  fetch: ActionMap
  create: ActionMap
  update: ActionMap
  archive: ActionMap
  setSort: string
  setFilter: string
  setPage: string
  merge: string
}

export const namespace = '@@boxmodel'

const createActionFactory = (modelName: string) => (operation: string): ActionMap => {
  const prefix = modelName.toUpperCase()
  return {
    request: `${namespace}/${prefix}_${operation}`,
    ok: `${namespace}/${prefix}_${operation}_OK`,
    fail: `${namespace}/${prefix}_${operation}_FAIL`,
  }
}

export function createMergeType(modelName: string) {
  const prefix = modelName.toUpperCase()
  return `${namespace}/${prefix}_MERGE`
}

export function createCustomTypes(modelName: string) {
  const prefix = modelName.toUpperCase()

  return {
    setSort: `${namespace}/${prefix}_SET_SORT`,
    setFilter:`${namespace}/${prefix}_SET_FILTER`,
    setPage: `${namespace}/${prefix}_SET_PAGE`,
  }
}

export function generateTypes(modelName: string): Types {
  const factory = createActionFactory(modelName)

  const get = factory('GET')
  const fetch = factory('FETCH')
  const create = factory('CREATE')
  const update = factory('UPDATE')
  const archive = factory('ARCHIVE')
  const merge = createMergeType(modelName)

  return { get, fetch, create, update, archive, merge, ...createCustomTypes(modelName) }
}
