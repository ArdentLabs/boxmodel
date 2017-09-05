import * as assert from 'assert'

import { combineReducers, createStore } from 'redux'

import BoxModel, { Model } from './index'

import { toGraphQLString } from './sagas'

describe('gql query generator', () => {
  it ('works as expected', () => {
    const gqlString = toGraphQLString({
      id: true,
      foo: true,
      nested: {
        works: true
      }
    })

    assert.equal(gqlString, `   id
    foo
    nested {
      works
    }`)
  })
})

describe('boxmodel', () => {
  const Parent = new Model('parent')
  const Child = new Model('child')

  Parent.define({
    children: [Child]
  })

  Child.define({
    parent: Parent
  })

  it('should initialize', () => {
    const boxmodel = new BoxModel({
      apiUrl: '',
      selector: (state) => state.boxes,
      schemas: [
        Parent,
        Child
      ]
    })

    const store = createStore(combineReducers({
      boxes: boxmodel.reducer
    }), {})

    assert.deepEqual(store.getState(), {
      boxes: {
        parent: {
          result: [],
          entities: {},
          loading: false,
          error: ''
        },
        child: {
          result: [],
          entities: {},
          loading: false,
          error: ''
        }
      }
    })

    it('should provide routes', () => {
      /*
      for (const route of boxmodel.routes) {
        // TODO more testing
      }
      */
    })
  })
})
