import * as assert from 'assert'
import * as randomstring from 'randomstring'
import { createStore, applyMiddleware, Store, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'

import types from './types'
import actions from './actions'
import reducer from './reducer'
import saga from './saga'
import selectors from './selectors'
import { reset } from '../config'
import { BoxModelState } from '.';
import { selectInternal } from './internal/selectors';

describe('redux module', () => {
  it('creates types correctly', () => {
    assert.deepStrictEqual(types('helloWorld'), {
      init: '@@boxmodel/HELLO_WORLD_INIT',
      one: {
        request: '@@boxmodel/HELLO_WORLD_ONE',
        ok: '@@boxmodel/HELLO_WORLD_ONE_OK',
        fail: '@@boxmodel/HELLO_WORLD_ONE_FAIL'
      },
      many: {
        request: '@@boxmodel/HELLO_WORLD_MANY',
        ok: '@@boxmodel/HELLO_WORLD_MANY_OK',
        fail: '@@boxmodel/HELLO_WORLD_MANY_FAIL'
      },
      create: {
        request: '@@boxmodel/HELLO_WORLD_CREATE',
        ok: '@@boxmodel/HELLO_WORLD_CREATE_OK',
        fail: '@@boxmodel/HELLO_WORLD_CREATE_FAIL'
      },
      update: {
        request: '@@boxmodel/HELLO_WORLD_UPDATE',
        ok: '@@boxmodel/HELLO_WORLD_UPDATE_OK',
        fail: '@@boxmodel/HELLO_WORLD_UPDATE_FAIL'
      },
      archive: {
        request: '@@boxmodel/HELLO_WORLD_ARCHIVE',
        ok: '@@boxmodel/HELLO_WORLD_ARCHIVE_OK',
        fail: '@@boxmodel/HELLO_WORLD_ARCHIVE_FAIL'
      },
      merge: '@@boxmodel/HELLO_WORLD_MERGE'
    })
  })

  it('creates action creators that create actions correctly', () => {
    const test = (modelName: string) => {
      const id = randomstring.generate()
      assert.deepStrictEqual(
        actions(modelName).one(id),
        {
          type: types(modelName).one.request,
          payload: {
            id,
            join: {}
          }
        }
      )
      const name = randomstring.generate()
      assert.deepStrictEqual(
        actions(modelName).many({
          filter: { name }
        }),
        {
          type: types(modelName).many.request,
          payload: {
            variables: {
              filter: { name }
            },
            join: {}
          }
        }
      )
      assert.deepStrictEqual(
        actions(modelName).create({ name }),
        {
          type: types(modelName).create.request,
          payload: {
            input: { name }
          }
        }
      )
      assert.deepStrictEqual(
        actions(modelName).update(id, { name }),
        {
          type: types(modelName).update.request,
          payload: {
            id,
            input: { name }
          }
        }
      )
      assert.deepStrictEqual(
        actions(modelName).archive(id),
        {
          type: types(modelName).archive.request,
          payload: {
            id
          }
        }
      )
      assert.deepStrictEqual(
        actions(modelName).merge({
          key1: 'data1',
          key2: { sub1: 'string2', sub2: 'bleh' }
        }),
        {
          type: types(modelName).merge,
          payload: {
            data: {
              key1: 'data1',
              key2: { sub1: 'string2', sub2: 'bleh' }
            }
          }
        }
      )
      assert.deepStrictEqual(
        actions(modelName).init(),
        {
          type: types(modelName).init,
          payload: { modelName }
        }
      )
    }

    test('helloWorld')
    test('lessonPlanFile')
    test(randomstring.generate())
  })

  it('creates selectors correctly', () => {
    const state = {
      boxmodel: {
        data: {
          course: {
            "210f6454-da1b-4f6d-844f-75800dd2db4b": {
              id: "210f6454-da1b-4f6d-844f-75800dd2db4b",
              title: "Test of Types",
              lessonPlansId: [
                "6168d01f-36db-4410-a13a-1fa182556a94",
                "15d7c3b4-6eb0-4b04-9722-7fb709b39212",
                "1a14ee9d-4016-4e3c-b8f6-c0f88b968c38",
                "6724ced6-3e41-4233-a58b-5b520f09c25b",
                "3681b106-89e0-4a48-9a2c-50edbe510f35"
              ]
            },
            _loading: Math.random() < 0.5,
            _error: Math.random() < 0.5
          },
          lessonPlan: {
            "6168d01f-36db-4410-a13a-1fa182556a94": {
              "id": "6168d01f-36db-4410-a13a-1fa182556a94",
              "title": "Types of Problem Sets"
            },
            "15d7c3b4-6eb0-4b04-9722-7fb709b39212": {
              "id": "15d7c3b4-6eb0-4b04-9722-7fb709b39212",
              "title": "Multiple Choices"
            }
          }
        }
      }
    }

    assert.strictEqual(selectors('course').loading(state), state.boxmodel.data.course._loading)
    assert.strictEqual(selectors('course').error(state), state.boxmodel.data.course._error)
    assert.deepStrictEqual(selectors('course').one(state, "210f6454-da1b-4f6d-844f-75800dd2db4b"), state.boxmodel.data.course["210f6454-da1b-4f6d-844f-75800dd2db4b"])
  })

  it('creates sagas correctly', (done) => {
    const sagaMiddleware = createSagaMiddleware()

    const store: Store<{ boxmodel: BoxModelState }> = createStore(combineReducers({ boxmodel: reducer }), {} as any, applyMiddleware(sagaMiddleware))

    sagaMiddleware.run(saga)

    const unsubscribe = store.subscribe(() => {
      if (Object.keys(store.getState().boxmodel._internal.typeMap).length) {
        unsubscribe()
        setTimeout(() => {
          store.dispatch(actions('course').init())
        }, 100)

      }
    })

    setTimeout(() => {
      console.log(JSON.stringify(store.getState().boxmodel._internal.schemas, null, '  '))
      done()
    }, 5000)
  }).timeout(6000)
})
