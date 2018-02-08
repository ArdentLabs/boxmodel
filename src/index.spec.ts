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

  Parent.mount({
    Create: true,
    Edit: true,
    Detail: true,
    Table: true
  })

  Child.mount({
    Table: true
  })

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
  } as any), {})

  it('should initialize', () => {
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
  })

  it('should provide routes', () => {
    assert.deepEqual(boxmodel.routes.map(route => route.path), [
      '/:parentModel/:parentId/add-parent', '/parent/:id/edit', '/parent/:id', '/add-parent', '/parent',
      '/child'
    ])
  })
})
