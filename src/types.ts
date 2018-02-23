import { toCapitalCase } from './utils'

export interface ActionMap {
  request: string
  ok: string
  fail: string
}

export interface ActionTypes {
  create: ActionMap
  one: ActionMap
  all: ActionMap
  update: ActionMap
  archive: ActionMap
  merge: string
  setSort: string
  setFilter: string
  setPage: string
}

export const createTypes = (
  namespace: string,
  modelName: string
): ActionTypes => {
  const prefix = toCapitalCase(modelName)
  const createActionMap = (operation: string): ActionMap => ({
    request: `${namespace}/${prefix}_${operation}`,
    ok: `${namespace}/${prefix}_${operation}_OK`,
    fail: `${namespace}/${prefix}_${operation}_FAIL`,
  })

  return {
    create: createActionMap('CREATE'),
    one: createActionMap('GET_ONE'),
    all: createActionMap('GET_ALL'),
    update: createActionMap('UPDATE'),
    archive: createActionMap('ARCHIVE'),
    merge: `${namespace}/${prefix}_MERGE`,
    setSort: `${namespace}/${prefix}_SET_SORT`,
    setFilter: `${namespace}/${prefix}_SET_FILTER`,
    setPage: `${namespace}/${prefix}_SET_PAGE`,
  }
}
