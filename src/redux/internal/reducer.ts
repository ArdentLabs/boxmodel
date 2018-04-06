import { AnyAction } from 'redux'

import types from './types'
import { TypeMap, Queries, Mutations } from './saga'

export interface InternalState {
  typeMap: TypeMap
  queries: Queries
  mutations: Mutations
}

const defaultState: InternalState = {
  typeMap: {},
  queries: {},
  mutations: {}
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
    default: {
      return state
    }
  }
}

export default reducer
