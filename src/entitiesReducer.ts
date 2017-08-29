import * as deepmerge from 'deepmerge'

import { schema } from 'normalizr'

import { Action} from '../index'

export const types = {
  MODEL_UPDATE: 'MODEL_UPDATE',
  MODEL_SORT: 'MODEL_SORT',

  MODEL_FETCH: 'MODEL_FETCH',
  MODEL_FETCH_OK: 'MODEL_FETCH_OK',
  MODEL_FETCH_FAIL: 'MODEL_FETCH_FAIL',

  MODEL_GET: 'MODEL_GET',
  MODEL_GET_OK: 'MODEL_GET_OK',
  MODEL_GET_FAIL: 'MODEL_GET_FAIL',

  MODEL_ARCHIVE: 'MODEL_ARCHIVE',
  MODEL_ARCHIVE_OK: 'MODEL_ARCHIVE_OK',
  MODEL_ARCHIVE_FAIL: 'MODEL_ARCHIVE_FAIL',

  MODEL_CREATE: 'MODEL_CREATE',
  MODEL_CREATE_OK: 'MODEL_CREATE_OK',
  MODEL_CREATE_FAIL: 'MODEL_CREATE_FAIL',
}

interface State {
  [entity: string]: {
    [id: string]: {
      [field: string]: any,
    },
  }
}

interface ModelAction extends Action {
  type: string
  payload: {
    entities: Partial<State>;
    schema?: schema.Entity;
    id?: string;
  }
}

export default (state: State = {}, action: ModelAction): State => {
  const { type, payload } = action

  switch (type) {
    case types.MODEL_UPDATE:
    case types.MODEL_CREATE_OK:
    case types.MODEL_FETCH_OK:
    case types.MODEL_GET_OK:
      return deepmerge(state, payload.entities) as State
    case types.MODEL_ARCHIVE_OK:
      // Null check
      if (!payload.schema || !payload.id) {
        console.error('Received an archiving action, but schema and/or id are not specified.')
        return state
      }

      // Destructure to take out the archived item
      const {
        [payload.schema.key]: {
          [payload.id]: _,
          ...remaining,
        },
        ...unaffectedEntities,
      } = state
      return {
        ...unaffectedEntities,
        [payload.schema.key]: remaining,
      }
    default:
      return state
  }
}
