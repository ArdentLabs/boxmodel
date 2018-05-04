import { createStore, applyMiddleware, Store, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import 'isomorphic-fetch'

import { configure } from '../../config'
import reducer, { SchemaState } from './reducer'
import { initSchema, loadJoin } from './sagas'
import { finalState } from '../../utils'

before(() => {
  configure({
    selector: (state) => state,
    apiUrl: 'https://ardent-api-next.ardentlabs.io'
  })
})

describe('schema module', () => {
  it('should initialize schemas correctly', (done) => {
    const sagaMiddleware = createSagaMiddleware()

    const store = createStore(reducer, {}, applyMiddleware(sagaMiddleware))

    function* testSaga() {
      yield* initSchema('course')
    }

    finalState(store).then((state) => {
      console.log(JSON.stringify(state, null, '  '))
      done(state.Course._error)
    })

    sagaMiddleware.run(testSaga)
  })

  it('should load join correctly', (done) => {
    const sagaMiddleware = createSagaMiddleware()

    const store: Store<{ schema: SchemaState }> = createStore(
      combineReducers({ schema: reducer }) as any,
      {},
      applyMiddleware(sagaMiddleware)
    )

    function* testLoad() {
      yield* loadJoin('Course', {
        classrooms: {
          lessons: {
            lessonPlan: true
          }
        },
        category: true,
        subject: true,
        level: true,
        part: true
      })

      yield* loadJoin('Course', {
        classrooms: {
          lessons: true
        },
        part: true
      })
    }

    finalState(store).then((state) => {
      console.log(JSON.stringify(state.schema, null, '  '))
      done(Object.values(state.schema).reduce((error, schema) => error || schema._error, false))
    })

    sagaMiddleware.run(testLoad)
  }).timeout(5000)
})
