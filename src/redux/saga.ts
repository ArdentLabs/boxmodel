import { AnyAction } from 'redux';
import { SagaIterator } from 'redux-saga'
import * as effects from 'redux-saga/effects'

import * as internal from './internal'

import types, { init } from './types'

function* model(action: AnyAction): SagaIterator {

  function* one(action: AnyAction): SagaIterator {
    console.log('one action caught by saga.')
  }

  function* many(action: AnyAction): SagaIterator {
    console.log('many action caught by saga.')
  }

  function* create(action: AnyAction): SagaIterator {
    console.log('create action caught by saga.')
  }

  const { modelName } = action.payload
  console.log('initializing saga for ' + modelName)

  yield effects.put({
    type: internal.types.INTROSPECTION_TYPE,
    payload: { modelName }
  })
  yield effects.all([
    effects.takeLatest(types(modelName).one.request, one)
  ])
}

function* root(): SagaIterator {
  yield* internal.saga()
  yield effects.takeEvery(init(), model)
}

export default root;
