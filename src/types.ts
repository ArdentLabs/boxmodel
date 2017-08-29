import { ActionMap, Options, Types } from '../index'

const createActionFactory = (modelName: string) => (operation: string): ActionMap => {
  const prefix = modelName.toUpperCase()
  return {
    request: `@@boxmodel/${prefix}_${operation}`,
    ok: `@@boxmodel/${prefix}_${operation}_OK`,
    fail: `@@boxmodel/${prefix}_${operation}_FAIL`,
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
