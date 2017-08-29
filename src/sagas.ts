import { Effect, all, call, put, select, takeLatest } from 'redux-saga/effects'
import { normalize } from 'normalizr'
import { Types, Action, Options } from '../index'
import { getRequest, getOk, getFail } from './types'

export function generateSagas(options: Options, types: Types) {
  const { modelName, schema, apiUrl, fields } = options
  const url = apiUrl + '/graphql'

  const getQuery = `
    query GetModel($id: ID!) {
      ${modelName}(id: $id) {
        ${fields}
      }
    }
  `

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

  function* getModel(action: Action) {
    try {
      const { id } = action.payload

      const res = yield call(callApi, getQuery, { id })
      const normalized = normalize(res.data.course, schema)

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

  function* fetchModel(action: Action) {
    try {

    } catch (err) {

    }
  }

  function* rootSaga() {
    yield all([
      takeLatest(getRequest(types.get), getModel),
      takeLatest(getRequest(types.fetch), fetchModel),
    ])
  }

  return rootSaga
}
