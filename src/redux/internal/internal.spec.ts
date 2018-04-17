import 'isomorphic-fetch'
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

import reducer from './reducer'
import saga from './saga'
import * as introspection from './introspection'
import { configure } from '../../config'
import * as assert from 'assert'

before(() => {
  configure({
    apiUrl: 'https://ardent-api-next.ardentlabs.io'
  })
})

describe('internal module', () => {
  it('has correct introspection queries', () => {
    console.log(introspection.INIT, '\n', introspection.TYPE)
    assert.equal(introspection.TYPE.indexOf('\n'), -1)
    assert.equal(introspection.INIT.indexOf('\n'), -1)
  })

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
