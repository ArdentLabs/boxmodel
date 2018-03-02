import { Query } from './typings'
import { ActionTypes } from './types'
import { Reducer, Action, AnyAction } from 'redux'
import { Entities } from './actions'

/**
 * Represents the state of 1 model.
 */
export interface ModelState<Model> {
  query: Query
  result: string[]
  entities: Entities<Model>
  history: Array<{
    query: Query
    result: string[]
  }>
  loading: boolean
  error: string | null
}

export const generateReducer = <Model>(
  types: ActionTypes,
  maxHistory: number = 10
): Reducer<ModelState<Model>> => {
  const defaultState: ModelState<Model> = {
    query: {},
    result: [],
    entities: {},
    history: [],
    loading: false,
    error: null,
  }

  return (state = defaultState, action) => {
    let { type, payload } = action

    switch (type) {
      // Request actions
      case types.create.request:
      case types.one.request:
      case types.all.request:
      case types.update.request:
      case types.archive.request: {
        return {
          ...state,
          loading: true,
        }
      }

      // OK actions
      case types.create.ok:
      case types.one.ok:
      case types.update.ok: {
        return {
          ...state,
          entities: {
            ...state.entities,
            [payload.entity.id]: {
              ...(state.entities[payload.entity.id] as any),
              ...payload.entity
            },
          },
          loading: false,
          error: null,
        }
      }
      case types.all.ok: {
        return {
          ...state,
          query: payload.query,
          result: payload.result,
          entities: {
            ...state.entities,
            ...payload.entities,
          },
          history: state.history
            .concat({
              query: state.query,
              result: state.result,
            })
            .slice(0, maxHistory),
          loading: false,
          error: null,
        }
      }
      case types.archive.ok: {
        let { [payload.id]: _, ...entities } = state.entities
        return {
          ...state,
          entities,
          loading: false,
          error: null,
        }
      }

      // Fail actions
      case types.create.fail:
      case types.one.fail:
      case types.all.fail:
      case types.update.fail:
      case types.archive.fail: {
        return {
          ...state,
          loading: false,
          error: payload.message,
        }
      }

      // Other actions
      case types.merge: {
        // Reminder: a merge action is not originated by the same model.
        return {
          ...state,
          entities: {
            ...state.entities,
            ...payload.entities,
          },
          loading: false,
          error: null,
        }
      }
      case types.setFilter: {
        return {
          ...state,
          query: {
            ...state.query,
            filter: payload.filter,
          },
        }
      }
      case types.setSort: {
        return {
          ...state,
          query: {
            ...state.query,
            sort: payload.sort,
          },
        }
      }
      case types.setPage: {
        return {
          ...state,
          query: {
            ...state.query,
            page: payload.page,
          },
        }
      }

      default: {
        return state
      }
    }
  }
}
