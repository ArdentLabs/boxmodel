import { config } from '../config'
import { memoize } from '../utils'

export interface ActionMap {
  request: string
  ok: string
  fail: string
}

export interface Types {
  one: ActionMap
  many: ActionMap
  create: ActionMap
  update: ActionMap
  archive: ActionMap
  merge: string
}

const types = (modelName: string): Types => {
  const prefix = modelName
    .split('')
    .map(
      (character) =>
        character === character.toUpperCase() && character !== character.toLowerCase()
          ? '_' + character
          : character.toUpperCase()
    )
    .join('')
  
  /**
   * Creates an action map for the given prefix and action.
   * `action` should be UPPER_CASE.
   */
  const createActionMap = (action: string): ActionMap => {
    return {
      request: `${config.namespace}/${prefix}_${action}`,
      ok: `${config.namespace}/${prefix}_${action}_OK`,
      fail: `${config.namespace}/${prefix}_${action}_FAIL`
    }
  }
  
  return {
    one: createActionMap('ONE'),
    many: createActionMap('MANY'),
    create: createActionMap('CREATE'),
    update: createActionMap('UPDATE'),
    archive: createActionMap('ARCHIVE'),
    merge: `${config.namespace}/${prefix}_MERGE`
  }
}

export const init = () => `${config.namespace}/MODEL_INIT`

export default memoize(types)
