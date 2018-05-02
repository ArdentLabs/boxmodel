import { memoize } from '../../utils'
import { config } from '../../config'
import { capitalize } from '../../names'

export interface TypeMap {
  request: string
  ok: string
  fail: string
}

export interface Types {
  init: string
  one: TypeMap
  many: TypeMap
  create: TypeMap
  update: TypeMap
  archive: TypeMap
  merge: string
}

const types = (modelName: string) => {
  const typeMap = (action: string) => {
    const actionBase = `${config.namespace}/${capitalize(modelName)}_${action.toUpperCase()}`
    return {
      request: actionBase,
      ok: `${actionBase}_OK`,
      fail: `${actionBase}_FAIL`
    }
  }

  return {
    init: `${config.namespace}/MODEL_INIT`,
    one: typeMap('one'),
    many: typeMap('many'),
    create: typeMap('create'),
    update: typeMap('update'),
    archive: typeMap('archive'),
    merge: `${config.namespace}/${capitalize(modelName)}_MERGE`
  }
}

export default memoize(types)
