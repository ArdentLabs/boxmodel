import * as deepmerge from 'deepmerge'

import { ModelState, Action, Types, Reducer } from '../index'

const initialState: ModelState = {
  result: [],
  entities: {},
  loading: false,
  error: null
}

export function generateReducer(types: Types): Reducer {
  return (state: ModelState = initialState, action: Action) => {
    const { type, payload } = action

    switch (type) {
      case types.merge:
        return deepmerge(state, payload as ModelState)

      case types.get.request:
      case types.fetch.request:
      case types.create.request:
      case types.update.request:
      case types.archive.request:
        return {
          ...state,
          loading: true,
        }

      case types.get.ok:
      case types.fetch.ok:
      case types.create.ok:
      case types.update.ok:
        return {
          ...state,
          result: payload.result || state.result,
          loading: false,
          error: null,
        }

      case types.archive.ok:
        const {
          entities: {
            [payload.id as string]: _,
            ...entities
          },
          ...rest
        } = state

        return {
          ...rest,
          entities,
          loading: false,
          error: null,
        }

      case types.get.fail:
      case types.fetch.fail:
      case types.create.fail:
      case types.update.fail:
      case types.archive.fail:
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
