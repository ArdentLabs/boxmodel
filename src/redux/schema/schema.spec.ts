import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { configure } from '../../config'
import reducer from './reducer'
import { initSchema } from './sagas'

before(() => {
  configure({
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

    sagaMiddleware.run(testSaga)

    setTimeout(() => {
      console.log(JSON.stringify(store.getState(), null, '  '))
      done()
    }, 500)
  })
})
