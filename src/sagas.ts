import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { normalize } from 'normalizr'
import * as pluralize from 'pluralize'

import { goBack } from './actions'
import { getMergeType } from './types'
import { ModelSchema, Types, Action, State } from '../index'

interface Entities {
  [modelName: string]: {
    [id: string]: any
  }
}

function* distributeEntities(normalized: Entities) {
  const keys = Object.keys(normalized)

  for (const key of keys) {
    yield put({
      type: getMergeType(key),
      payload: { entities: normalized[key] },
    })
  }
}

export function generateSaga(schema: ModelSchema, types: Types, apiUrl: string) {
  const name = schema.key
  const pluralName = pluralize(name)

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
        payload: err,
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

      const router = yield select((state: State) =>
        state.router && state.router.location && state.router.location.pathname
      )

      const tokens = router.split('/')

      if (tokens.length === 4) {
        // URL matches /:parentName/:parentId/:modelName
        const parentName = tokens[1]
        const parentId = tokens[2]
        // Filter by the parent
        filter[`${parentName}Id`] = parentId
      } else if (tokens.length === 2) {
        // URL matches /:modelName
      } else {
        throw new Error('Unknown URL format, cannot determine if there is a parent')
      }

      const fetchQuery = `
        query Fetch${title}($filter: Filters, $sort: Sorts) {
          ${pluralName}(filter: $filter, sort: $sort) {
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
        payload: err,
        error: true,
      })
    }
  }

  function* createModel(action: Action) {
    try {
      const { values, fields } = action.payload

      if (!fields) {
        throw new Error(`Fields required for creating a ${title}`)
      }

      const createQuery = `
        mutation Create${title}($input: Create${title}Input!) {
          create${title}(input: $input) {
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
        payload: err,
        error: true,
      })
    }
  }

  function* updateModel(action: Action) {
    try {
      const { id, values, fields } = action.payload

      if (!id) {
        throw new Error(`ID required for updating a ${title}`)
      }

      if (!fields) {
        throw new Error(`Fields required for updating a ${title}`)
      }

      const updateQuery = `
        mutation Update${title}($input: Update${title}Input!) {
          update${title}(input: $input) {
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
        payload: err,
        error: true,
      })
    }
  }

  function* archiveModel(action: Action) {
    try {
      const { id, fields } = action.payload

      if (!id) {
        throw new Error(`ID required for archiving a ${title}`)
      }

      if (!fields) {
        throw new Error(`ID required for archiving a ${title}`)
      }

      const archiveQuery = `
        mutation Archive${title}($id: ID!) {
          archive${title}(id: $id) {
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
        payload: err,
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
