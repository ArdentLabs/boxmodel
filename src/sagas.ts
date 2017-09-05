import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { normalize } from 'normalizr'
import { plural } from 'pluralize'

import { goBack } from './actions'
import { getMergeType } from './types'
import { ModelSchema, Types, Action } from '../index'

interface Entities {
  [modelName: string]: {
    [id: string]: any
  }
}

function* distributeEntities(entities: Entities) {
  const keys = Object.keys(entities)

  for (const key of keys) {
    yield put({
      type: getMergeType(key),
      payload: { entities: entities[key] },
    })
  }
}

const pathnameSelector = (state: any) =>
  (state.router && state.router.location && state.router.location.pathname)

const formatError = (err: any) => err.message || err.toString() || 'Unknown error'

export function generateSaga(schema: ModelSchema, types: Types, apiUrl: string) {
  const name = schema.key
  const pluralName = plural(name)

  const title = name.substr(0, 1).toUpperCase() + name.substr(1)
  const url = apiUrl + '/graphql'

  // Query a GraphQL API endpoint.
  async function callApi(
    // The query string
    gqlQuery: string,
    // Query variables go in here
    variables?: any,
  ): Promise<any> {
    const headers = new Headers()
    headers.set('Accept', 'application/json')
    headers.set('Content-Type', 'application/json')

    const fetchOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: gqlQuery,
        // We're ignoring operationName here since I don't know what it does yet.
        variables,
      }),
    }

    try {
      const result = await fetch(url, fetchOptions)
      return result.json()
    } catch (err) {
      console.error(err)
      return Promise.reject(err)
    }
  }

  function* getModel(action: Action) {
    try {
      const { id, fields } = action.payload

      if (!id) {
        throw new Error(`ID required for reading a single ${title}`)
      }

      if (!fields) {
        throw new Error(`Fields required for reading a single ${title}`)
      }

      const getQuery = `
        query Get${title}($id: ID!) {
          ${name}(id: $id) {
            id
            ${fields}
          }
        }
      `

      const res = yield call(callApi, getQuery, { id })
      const { entities, result } = normalize(res.data[name], schema)

      yield* distributeEntities(entities)

      yield put({
        type: types.get.ok,
        payload: { result },
      })
    } catch (err) {
      yield put({
        type: types.get.fail,
        payload: formatError(err),
        error: true,
      })
    }
  }

  function* fetchModel(action: Action) {
    try {
      const { variables, fields } = action.payload

      if (!fields) {
        throw new Error(`Fields required for reading several ${title}`)
      }

      const sort = variables.sort || {}
      const filter = variables.filter || {}
      const page = variables.page || {}

      const pathname = yield select(pathnameSelector)
      const tokens = pathname.split('/')

      if (tokens.length === 4) {
        // URL matches /:parentName/:parentId/
        const parentName = tokens[1]
        const parentId = tokens[2]
        // Filter by the parent
        filter[`${parentName}Id`] = parentId
      } else if (tokens.length === 2) {
        // URL matches /:modelName
      } else {
        throw new Error(`Unknown URL format: ${pathname}`)
      }

      const fetchQuery = `
        query Fetch${title}($filter: Filters, $sort: Sorts) {
          ${pluralName}(filter: $filter, sort: $sort) {
            id
            ${fields}
          }
        }
      `

      const res = yield call(callApi, fetchQuery, { sort, filter, page })
      const { entities, result } = normalize(res.data[pluralName], [schema])

      yield* distributeEntities(entities)

      yield put({
        type: types.fetch.ok,
        payload: { result },
      })
    } catch (err) {
      yield put({
        type: types.fetch.fail,
        payload: formatError(err),
        error: true,
      })
    }
  }

  function* createModel(action: Action) {
    try {
      const { values } = action.payload

      const fields = typeof action.payload.fields === 'string'
        ? action.payload.fields
        : Object.keys(values).join('\n')

      const pathname = yield select(pathnameSelector)
      const tokens = pathname.split('/')

      if (tokens.length === 5) {
        // URL matches /:parentName/:parentId/add-${modelName}/
        const parentName = tokens[1]
        const parentId = tokens[2]
        // Add the parent to the values to create with
        values[`${parentName}Id`] = parentId
      } else if (tokens.length === 2) {
        // URL matches /add-${modelName}
      } else {
        throw new Error(`Unknown URL format: ${pathname}`)
      }

      const createQuery = `
        mutation Create${title}($input: Create${title}Input!) {
          create${title}(input: $input) {
            id
            ${fields}
          }
        }
      `

      const res = yield call(callApi, createQuery, { input: values })
      const model = res.data[`create${title}`]
      const { entities, result } = normalize(model, schema)

      yield* distributeEntities(entities)

      yield put({
        type: types.create.ok,
        payload: { result },
      })

      // Redirect to previous page
      yield put(goBack())
    } catch (err) {
      yield put({
        type: types.create.fail,
        payload: formatError(err),
        error: true,
      })
    }
  }

  function* updateModel(action: Action) {
    try {
      const { id, values } = action.payload

      if (!id) {
        throw new Error(`ID required for updating a ${title}`)
      }

      const fields = typeof action.payload.fields === 'string'
        ? action.payload.fields
        : Object.keys(values).join('\n')

      const updateQuery = `
        mutation Update${title}($input: Update${title}Input!) {
          update${title}(input: $input) {
            id
            ${fields}
          }
        }
      `

      const res = yield call(callApi, updateQuery, { input: { id, ...values } })
      const { entities, result } = normalize(res.data[`update${title}`], schema)

      yield* distributeEntities(entities)

      yield put({
        type: types.update.ok,
        payload: { result },
      })

      // Redirect to previous page
      yield put(goBack())
    } catch (err) {
      console.error(err)
      yield put({
        type: types.update.fail,
        payload: formatError(err),
        error: true,
      })
    }
  }

  function* archiveModel(action: Action) {
    try {
      const { id } = action.payload

      if (!id) {
        throw new Error(`ID required for archiving a ${title}`)
      }

      const fields = typeof action.payload.fields === 'string'
        ? action.payload.fields
        : ''

      const archiveQuery = `
        mutation Archive${title}($id: ID!) {
          archive${title}(id: $id) {
            id
            ${fields}
          }
        }
      `

      const res = yield call(callApi, archiveQuery, { id })
      const { entities, result } = normalize(res.data[`archive${title}`], schema)

      yield* distributeEntities(entities)

      yield put({
        type: types.archive.ok,
        payload: { id, result },
      })
    } catch (err) {
      yield put({
        type: types.archive.fail,
        payload: formatError(err),
        error: true,
      })
    }
  }

  function* rootSaga() {
    yield all([
      takeLatest(types.get.request, getModel),
      takeLatest(types.fetch.request, fetchModel),
      takeLatest(types.create.request, createModel),
      takeLatest(types.update.request, updateModel),
      takeLatest(types.archive.request, archiveModel),
    ])
  }

  return rootSaga
}
