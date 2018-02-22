import { Action, Entities, Sorts, Filters, Pagination } from './actions'
import { Types } from './types'

export interface ModelState<Model> {
  result: ReadonlyArray<string>
  entities: Entities<Model>
  sort: Sorts
  filter: Filters
  page: Pagination
  loading: boolean
  error: string
}

export interface ModelAction<Model> extends Action {
  type: string
  payload: {
    id?: string
    result?: ReadonlyArray<string> | string
    entities: Entities<Model>
    message?: string
  }
}

export type ModelReducer<Model> = (state: ModelState<Model>, action: ModelAction<Model>) => ModelState<Model>

function mergeEntities<Model>(state: Entities<Model>, entities: Entities<Model>) {
  const result = Object.assign({}, state)

  for (const modelName of Object.keys(entities)) {
    result[modelName] = {
      ...result[modelName],
      ...entities[modelName],
    }
  }

  return result
}

export function generateReducer<Model>(types: Types): ModelReducer<Model> {
  const initialState: ModelState<Model> = {
    result: [],
    entities: {},
    sort: {},
    filter: {},
    page: {},
    loading: false,
    error: '',
  }

  return (state: ModelState<Model> = initialState, action: ModelAction<Model>): ModelState<Model> => {
    const { type, payload } = action

    switch (type) {
      case types.merge:
        return {
          ...state,
          entities: mergeEntities(state.entities, payload.entities),
        }

      case types.setSort:
        return {
          ...state,
          sort: payload as any
        }

      case types.setFilter:
        return {
          ...state,
          filter: payload as any
        }

      case types.setPage:
        return {
          ...state,
          page: payload as any
        }

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
        return {
          ...state,
          result: [payload.result] as ReadonlyArray<string>,
          loading: false,
          error: '',
        }

      case types.create.ok:
        return {
          ...state,
          result: [
            payload.result,
            ...state.result,
          ] as ReadonlyArray<string>,
          loading: false,
          error: '',
        }

      case types.update.ok:
        return {
          ...state,
          loading: false,
          error: '',
        }

      case types.archive.ok: {
        const {
          entities: { [payload.id as string]: _, ...entities },
          ...rest,
        } = state

        return {
          ...rest,
          entities,
          loading: false,
          error: '',
        }
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
