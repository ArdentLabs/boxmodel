import { Reducer, Action, Dispatch } from 'redux'
import { SagaIterator, SagaMiddleware } from 'redux-saga'
import { all, call, put, takeLatest, fork } from 'redux-saga/effects'

import { GraphQLResponseData } from './typings'
import { ActionMap } from './types'
import { toPascalCase } from './utils'
import introspection from './introspection'
import { createSelector } from 'reselect'

interface InternalTypes {
  introspection: ActionMap
}

interface GQLType {
  name: string
  fields: GQLField[]
  kind: string
  ofType: GQLType
}

interface GQLField {
  name: string
  type: GQLType
  args: Array<{
    name: string
  }>
}

// In a model link, the key under which this data is stored is the field name; the `name` field of `ModelLink` is the model name.
export interface ModelLink {
  modelName: string
  many: boolean
}

export interface Model {
  fields: string[]
  links: {
    [modelName: string]: ModelLink
  }
}

export interface InternalState {
  ready: boolean
  error: string | null
  models: {
    // modelName should be camelCase
    [modelName: string]: Model
  }
}

export interface InternalSelectors {
  /** Only includes fields that are not references to other things. */
  fields: (state: any, modelName: string) => string[]
  /** All fields that are references to other things. */
  links: (state: any, modelName: string) => { [modelName: string]: ModelLink }
}

export interface Internals {
  reducer: Reducer<InternalState>
  selectors: InternalSelectors
  saga: () => SagaIterator
}

/**
 *
 * @param namespace The namespace of boxmodel actions
 * @param query The function used for querying with graphql
 * @param modelNames A list of names of all the models that boxmodel will work with
 */
export const generateInternals = (
  namespace: string,
  query: (query: string, variables?: object) => Promise<GraphQLResponseData>,
  selectInternal: (state: any) => InternalState,
  modelNames: string[]
): Internals => {
  // Action types
  const prefix = 'INTERNAL'
  const createActionMap = (operation: string): ActionMap => ({
    request: `${namespace}/${prefix}_${operation}`,
    ok: `${namespace}/${prefix}_${operation}_OK`,
    fail: `${namespace}/${prefix}_${operation}_FAIL`,
  })
  const types = {
    introspection: createActionMap('INTROSPECTION'),
  }

  // Sagas
  // Introspection query handler
  function* queryIntrospection(): SagaIterator {
    const response: GraphQLResponseData<{ fields: GQLField[] }> = yield call(
      query,
      introspection
    )

    if (response.errors) {
      yield put({
        type: types.introspection.fail,
        payload: {
          reason: JSON.stringify(response.errors, null, '  '),
        },
      })
    } else {
      // Query successful, parse and store data.
      // Normalize models, queries and mutations to be more efficient
      const { queries: { fields: queryFields } } = response.data
      const queries: { [queryName: string]: GQLField } = queryFields.reduce(
        (queryStore: { [queryName: string]: GQLField }, queryItem) => {
          queryStore[queryItem.name] = queryItem
          return queryStore
        },
        {}
      )

      // Integrity check
      for (let modelName of modelNames) {
        if (!(modelName in queries)) {
          yield put({
            type: types.introspection.fail,
            payload: {
              reason: `Error when initializing boxmodel: could not find '${modelName}' as an available query.`,
            },
          })
          return
        }
      }

      // Establish type map
      // Maps type names (PascalCase) to model names (camelCase)
      const typeMap: {
        [typeName: string]: string
      } = {}
      for (let modelName of modelNames) {
        typeMap[queries[modelName].type.name] = modelName
      }

      // Maps model names (camelCase) to their respective model data
      const modelMap: {
        [modelName: string]: Model
      } = {}

      for (let modelName of modelNames) {
        modelMap[modelName] = {
          fields: queries[modelName].type.fields.map(field => field.name),
          links: queries[modelName].type.fields.reduce(
            (links, field) => {
              // Go to the root type - strip non-null and list types
              let linkedType = field.type
              let many = false
              while (
                linkedType.kind === 'NON_NULL' ||
                linkedType.kind === 'LIST'
              ) {
                if (linkedType.kind === 'LIST') {
                  many = true
                }
                linkedType = linkedType.ofType
              }

              // If this is a known custom type, then we have found a link.
              if (linkedType.name in typeMap) {
                links[field.name] = {
                  modelName: typeMap[linkedType.name],
                  many,
                }
              }

              return links
            },
            {} as { [modelName: string]: ModelLink }
          ),
        }
      }

      yield put({
        type: types.introspection.ok,
        payload: modelMap,
      })
    }
  }

  function* saga(): SagaIterator {
    yield fork(queryIntrospection)
  }

  // Reducer
  const defaultState: InternalState = {
    ready: false,
    error: null,
    models: {},
  }

  const reducer: Reducer<InternalState> = (state = defaultState, action) => {
    const { type, payload } = action

    switch (type) {
      case types.introspection.ok: {
        return {
          ready: true,
          error: null,
          models: payload,
        }
      }
      case types.introspection.fail: {
        return {
          ready: true,
          error: (payload && payload.reason) || 'unknown',
          models: {},
        }
      }
      default: {
        return state
      }
    }
  }

  const selectModel = createSelector(
    selectInternal,
    (_: any, modelName: string) => modelName,
    (internals, modelName) => internals.models[modelName]
  )

  const selectFields = createSelector(selectModel, model =>
    model.fields.filter(field => !(field in model.links))
  )

  const selectLinks = createSelector(selectModel, model => model.links)

  const selectors = {
    fields: selectFields,
    links: selectLinks,
  }

  // Return
  return {
    reducer,
    selectors,
    saga,
  }
}
