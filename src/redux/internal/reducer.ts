import { AnyAction } from 'redux'

import types from './types'
import { TypeMap, Queries, Mutations, Schemas } from './saga'

export interface InternalState {
  typeMap: TypeMap
  queries: Queries
  mutations: Mutations
  schemas: Schemas
}

const defaultState: InternalState = {
  typeMap: {},
  queries: {},
  mutations: {},
  schemas: {}
}

const reducer = (state: InternalState = defaultState, action: AnyAction) => {
  const { type, payload } = action

  switch (type) {
    case types.INTROSPECTION_INIT: {
      return {
        ...state,
        ...payload
      }
    }
    case types.INTROSPECTION_TYPE_OK: {
      return {
        ...state,
        schemas: {
          ...state.schemas,
          ...payload
        }
      }
    }
    default: {
      return state
    }
  }
}

export default reducer
