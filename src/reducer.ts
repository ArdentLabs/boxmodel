import { default as deepmerge } from 'deepmerge'

import { ModelState, Action, Types, Reducer } from '../index'

export function generateReducer<Model>(types: Types): Reducer<Model> {
  const initialState: ModelState<Model> = {
    result: [],
    entities: {},
    loading: false,
    error: '',
  }

  return (state: ModelState<Model> = initialState, action: Action) => {
    const { type, payload } = action

    switch (type) {
      case types.merge:
        return deepmerge(state, payload as ModelState<Model>)

      case types.get.request:
      case types.fetch.request:
      case types.create.request:
      case types.update.request:
      case types.archive.request:
        return {
          ...state,
          loading: true,
        }

      case types.fetch.ok:
        return {
          ...state,
          result: payload.result as ReadonlyArray<string>,
          loading: false,
          error: '',
        }

      case types.get.ok:
      case types.create.ok:
      case types.update.ok:
        return {
          ...state,
          result: [payload.result] as ReadonlyArray<string>,
          loading: false,
          error: '',
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
          error: '',
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
