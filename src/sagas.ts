import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { normalize } from 'normalizr'
import { Types, Action, Options, Paths } from '../index'
import { getRequest, getOk, getFail } from './types'

export function generateSagas(options: Options, types: Types, paths: Paths) {
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
        type: getOk(types.get),
        payload: normalized,
      })
    } catch (err) {
      yield put({
        type: getFail(types.get),
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
        type: getOk(types.fetch),
        payload: normalized,
      })
    } catch (err) {
      yield put({
        type: getFail(types.fetch),
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
      const normalized = normalize(res.data[`create${title}`], schema)

      yield put({
        type: getOk(types.create),
        payload: normalized,
      })

      // Redirect to detailed page
      const previous = yield select((state: any) =>
        state.router && state.router.location && state.router.location.state
      )
      const { from } = previous || { from: { pathname: `/${pluralName}/` + id } }
      yield put(push(from))
    } catch (err) {
      yield put({
        type: getFail(types.create),
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
        type: getOk(types.update),
        payload: normalized,
      })

      // Redirect to previous page
      const previous = yield select((state: any) =>
        state.router && state.router.location && state.router.location.state
      )
      const { from } = previous || { from: { pathname: `/${pluralName}/` + id } }
      yield put(push(from))
    } catch (err) {
      console.error(err)
      yield put({
        type: getFail(types.update),
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
        type: getOk(types.archive),
        payload: { id },
      })
    } catch (err) {
      yield put({
        type: getFail(types.archive),
        payload: err,
        error: true,
      })
    }
  }

  function* rootSaga() {
    yield all([
      takeLatest(getRequest(types.get), getModel),
      takeLatest(getRequest(types.fetch), fetchModel),
      takeLatest(getRequest(types.create), createModel),
      takeLatest(getRequest(types.update), updateModel),
      takeLatest(getRequest(types.archive), archiveModel),
    ])
  }

  return rootSaga
}
