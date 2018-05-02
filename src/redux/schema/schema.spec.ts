import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import 'isomorphic-fetch'

import { configure } from '../../config'
import reducer from './reducer'
import { initSchema } from './sagas'
import { finalState } from '../../utils'

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

    finalState(store).then((state) => {
      console.log(JSON.stringify(state, null, '  '))
      done(state.Course._error)
    })

    sagaMiddleware.run(testSaga)
  })
})
