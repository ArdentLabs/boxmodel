import * as assert from 'assert'

import { combineReducers, createStore } from 'redux'

import { BoxModel, Model } from './index'

import { diff } from './sagas'

describe('diffing algorithm', () => {
  it('should work', () => {
    const difference = diff({
      foo: 'unchanged',
      bar: 'update this',
      baz: 'deleted',
      deep: {
        update: 'should work',
        deletion: 'ignored'
      }
    }, {
      foo: 'unchanged',
      bar: 'updated',
      deep: {
        update: 'works',
        add: 'ignored'
      }
    })

    assert.deepEqual(difference, {
      bar: 'updated',
      deep: {
        update: 'works'
      }
    })
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
