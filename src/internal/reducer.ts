import { AnyAction } from 'redux';

import * as types from './types'
import { TypeMap, Queries, Mutations } from './saga'

export interface State {
  typeMap: TypeMap
  queries: Queries
  mutations: Mutations
}

const defaultState: State = {
  typeMap: {},
  queries: {},
  mutations: {}
}

const reducer = (state: State = defaultState, action: AnyAction) => {
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
