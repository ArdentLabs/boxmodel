import { all, call, put, takeLatest } from 'redux-saga/effects'
import { goBack } from './actions'
import { normalize } from 'normalizr'
import { Types, Action, Options } from '../index'

export function generateSagas(options: Options, types: Types) {
  const { schema, apiUrl, fields } = options
  const name = options.modelName
  const title = name.substr(0, 1).toUpperCase() + name.substr(1)
  const pluralName = options.pluralModelName
  const url = apiUrl + '/graphql'

  // Query a GraphQL API endpoint.
  async function callApi(
    // The query string
    gqlQuery: string,
    // Query variables go in here
    variables?: any,
  ): Promise<any> {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
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

  const getQuery = `
    query Get${title}($id: ID!) {
      ${name}(id: $id) {
        ${fields}
      }
    }
  `

  function* getModel(action: Action) {
    try {
      const { id } = action.payload

      if (!id) {
        throw new Error(`ID required for reading a single ${title}`)
      }

      const res = yield call(callApi, getQuery, { id })
      const normalized = normalize(res.data[name], schema)

      yield put({
        type: types.get.ok,
        payload: normalized,
      })
    } catch (err) {
      yield put({
        type: types.get.fail,
        payload: err,
        error: true,
      })
    }
  }

  const fetchQuery = `
    query Fetch${title}($filter: Filters, $sort: Sorts) {
      ${pluralName}(filter: $filter, sort: $sort) {
        ${fields}
      }
    }
  `

  function* fetchModel(action: Action) {
    try {
      const { filters, sorts } = action.payload

      const res = yield call(callApi, fetchQuery, { filters, sorts })
      const normalized = normalize(res.data[pluralName], [schema])

      yield put({
        type: types.fetch.ok,
        payload: normalized,
      })
    } catch (err) {
      yield put({
        type: types.fetch.fail,
        payload: err,
        error: true,
      })
    }
  }

  const createQuery = `
    mutation Create${title}($input: Create${title}Input!) {
      create${title}(input: $input) {
        ${fields}
      }
    }
  `

  function* createModel(action: Action) {
    try {
      const { values } = action.payload

      const res = yield call(callApi, createQuery, { input: values })
      const model = res.data[`create${title}`]
      const normalized = normalize(model, schema)

      yield put({
        type: types.create.ok,
        payload: normalized,
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

  const updateQuery = `
    mutation Update${title}($input: Update${title}Input!) {
      update${title}(input: $input) {
        ${fields}
      }
    }
  `

  function* updateModel(action: Action) {
    try {
      const { id, values } = action.payload

      if (!id) {
        throw new Error(`ID required for updating ${title}`)
      }

      const res = yield call(callApi, updateQuery, { input: { id, ...values }})
      const normalized = normalize(res.data[`update${title}`], schema)

      yield put({
        type: types.update.ok,
        payload: normalized,
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

  const archiveQuery = `
    mutation Archive${title}($id: ID!) {
      archive${title}(id: $id) {
        ${fields}
      }
    }
  `

  function* archiveModel(action: Action) {
    try {
      const { id } = action.payload

      if (!id) {
        throw new Error(`ID required for archiving ${title}`)
      }

      yield call(callApi, archiveQuery, { id })

      yield put({
        type: types.archive.ok,
        payload: { id },
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
