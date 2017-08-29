import { ModelState, Action, Types, Reducer } from '../index'

const initialState: ModelState = {
  result: [],
  loading: false,
  error: null
}

export function generateReducer(types: Types): Reducer {
  return (state: ModelState = initialState, action: Action) => {
    const { type, payload } = action
    switch (type) {
      case types.get.request:
      case types.fetch.request:
        return {
          ...state,
          loading: true,
        }

      case types.get.ok:
      case types.fetch.ok:
        return {
          ...state,
          error: null,
          loading: false,
        }

      case types.get.fail:
      case types.fetch.fail:
        return {
          ...state,
          error: payload.message || payload.toString() || 'Unknown error',
          loading: false,
        }

      default:
        return state
    }
  }
}
