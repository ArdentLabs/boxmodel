import * as deepmerge from 'deepmerge'

import {Reducer} from 'redux'
import {schema} from 'normalizr'

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

interface Action {
  type: string
  payload: {
    entities?: Partial<State>;
    schema?: schema.Entity;
    id?: string;
  }
  meta: any
  error: any
}

export default  (state: State = {}, action: Action): State => {
  const {type, payload, meta, error} = action

  switch (type) {
    case types.MODEL_UPDATE:
    case types.MODEL_CREATE_OK:
    case types.MODEL_FETCH_OK:
    case types.MODEL_GET_OK:
      return deepmerge(state, payload.entities)
    case types.MODEL_ARCHIVE_OK:
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
