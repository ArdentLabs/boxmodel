import * as assert from 'assert'
import * as randomstring from 'randomstring'

import types, { init } from './types'
import actions from './actions'

describe('redux module', () => {
  it('creates types correctly', () => {
    assert.deepStrictEqual(types('helloWorld'), {
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
          type: init(),
          payload: { modelName }
        }
      )
    }
    
    test('helloWorld')
    test('lessonPlanFile')
    test(randomstring.generate())
  })
})
