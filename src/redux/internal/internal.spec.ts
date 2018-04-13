import 'isomorphic-fetch'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import reducer from './reducer'
import saga from './saga'
import { configure, reset } from '../../config'

before(() => {
  configure({
    apiUrl: 'https://ardent-api-next.ardentlabs.io'
  })
})

describe('internal module', () => {
  it('can initialize introspection', (done) => {
    const sagaMiddleware = createSagaMiddleware()
    const store = createStore(reducer, applyMiddleware(sagaMiddleware))

    const unsubscribe = store.subscribe(() => {
      if (Object.keys(store.getState().typeMap).length) {
        // console.log(JSON.stringify(store.getState(), null, ' '))
        unsubscribe()
        done()
      }
    })

    sagaMiddleware.run(saga)
  })
})
