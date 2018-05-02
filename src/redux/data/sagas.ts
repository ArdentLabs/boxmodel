import { AnyAction } from 'redux'
import { SagaIterator } from 'redux-saga'
import * as effects from 'redux-saga/effects'

import { initSchema } from '../schema'
import types from './types'

const initialized: Set<string> = new Set()

function* model(a: AnyAction): SagaIterator {
  const { payload } = a
  const { modelName } = payload
  if (initialized.has(modelName)) {
    return
  }
  initialized.add(modelName)
  yield* initSchema(modelName)

  function* one(action: AnyAction): SagaIterator {
    console.log('one action caught by saga.')
  }

  function* many(action: AnyAction): SagaIterator {
    console.log('many action caught by saga.')
  }

  function* create(action: AnyAction): SagaIterator {
    console.log('create action caught by saga.')
  }

  function* update(action: AnyAction): SagaIterator {
    console.log('update action caught by saga.')
  }

  function* archive(action: AnyAction): SagaIterator {
    console.log('archive action caught by saga.')
  }

  yield effects.takeLatest(types(modelName).one.request, one)
  yield effects.takeLatest(types(modelName).many.request, many)
  yield effects.takeLatest(types(modelName).create.request, create)
  yield effects.takeLatest(types(modelName).update.request, update)
  yield effects.takeLatest(types(modelName).archive.request, archive)
}

function* saga() {
  yield effects.takeEvery()
}
