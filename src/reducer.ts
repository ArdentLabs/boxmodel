import { getRequest, getOk, getFail } from './types'
import { ModelState, Action, Types, Reducer } from '../index'

const initialState: ModelState = {
  result: [],
  loading: false,
  error: null
}

export function generateReducer(
  modelName: string,
  types: Types,
): Reducer {
  return (state: ModelState = initialState, action: Action) => {
    const { type, payload } = action
    switch (type) {
      case getRequest(types.get):
      case getRequest(types.fetch):
        return {
          ...state,
          loading: true,
        }

      case getOk(types.get):
      case getOk(types.fetch):
        return {
          ...state,
          error: null,
          loading: false,
        }

      case getFail(types.get):
      case getFail(types.fetch):
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
