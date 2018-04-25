import { AnyAction } from 'redux'
import { SagaIterator } from 'redux-saga'
import { initSchema } from '../schema'

const resolved: Set<string> = new Set()

function* model(a: AnyAction): SagaIterator {
  const { payload } = a
  const { modelName } = payload
  if (resolved.has(modelName)) {
    return
  }
  resolved.add(modelName)
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
}
