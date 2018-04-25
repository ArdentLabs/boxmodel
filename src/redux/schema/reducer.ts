import { AnyAction } from 'redux'

import types from './types'

export interface Joins {
  [fieldName: string]: {
    type: string,
    many: boolean,
  }
}

export interface SchemaState {
  [TypeName: string]: {
    fields: string[],
    joins: Joins,
    _error?: any
  }
}

const defaultState: SchemaState = {}

const reducer = (state: SchemaState = defaultState, action: AnyAction) => {
  const { type, payload } = action

  switch (type) {
    case types.SCHEMA_OK:
      return {
        ...state,
        ...payload
      }
    case types.SCHEMA_FAIL:
      return {
        ...state,
        ...payload
      }
    default:
      return state
  }
}

export default reducer
