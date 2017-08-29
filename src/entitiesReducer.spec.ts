import { deepEqual } from 'assert'

import { combineReducers, createStore, Store } from 'redux'
import { normalize, schema } from 'normalizr'

import entitiesReducer, { types } from './entitiesReducer'

const lessonSchema = new schema.Entity('lessons')

describe('entitiesReducer', () => {
  const store: Store<{ entities: any }> = createStore(combineReducers({
    entities: entitiesReducer,
  }))

  it('should allow model creation', () => {
    store.dispatch({
      type: types.MODEL_CREATE_OK,
      payload: {
        entities: normalize({
          lesson: {
            id: '11111111-1111-1111-111111111111',
            title: 't1',
            content: 'c1',
          },
        }, {
          lesson: lessonSchema
        }).entities
      }
    })

    deepEqual(store.getState(), {
      entities: {
        lessons: {
          '11111111-1111-1111-111111111111': {
            id: '11111111-1111-1111-111111111111',
            title: 't1',
            content: 'c1',
          }
        }
      }
    })

    store.dispatch({
      type: types.MODEL_CREATE_OK,
      payload: {
        entities: normalize({
          lesson: {
            id: '11111111-1111-1111-111111111112',
            title: 't2',
            content: 'c2',
          }
        }, {
          lesson: lessonSchema
        }).entities
      }
    })

    deepEqual(store.getState(), {
      entities: {
        lessons: {
          '11111111-1111-1111-111111111111': {
            id: '11111111-1111-1111-111111111111',
            title: 't1',
            content: 'c1',
          },
          '11111111-1111-1111-111111111112': {
            id: '11111111-1111-1111-111111111112',
            title: 't2',
            content: 'c2',
          }
        }
      }
    })
  })

  it('should allow model fetches and gets', () => {
    store.dispatch({
      type: types.MODEL_FETCH_OK,
      payload: {
        entities: normalize({
          lesson: [
            {
              id: '12345678-1234-1234-123456789012',
              beep: 'boop'
            },
            {
              id: '09876543-0987-0987-098765432109',
              bop: 'bap'
            }
          ]
        }, {
          lesson: [lessonSchema]
        }).entities
      }
    })

    deepEqual(store.getState().entities.lessons['12345678-1234-1234-123456789012'], {
      id: '12345678-1234-1234-123456789012',
      beep: 'boop'
    })

    deepEqual(store.getState().entities.lessons['09876543-0987-0987-098765432109'], {
      id: '09876543-0987-0987-098765432109',
      bop: 'bap',
    })
  })

  it('should allow model updates', () => {
    store.dispatch({
      type: types.MODEL_UPDATE,
      payload: {
        entities: normalize({
          lesson: {
            id: '11111111-1111-1111-111111111111',
            title: 'tfff',
            content: 'cont',
          },
        }, {
          lesson: lessonSchema,
        }).entities,
      },
    })

    deepEqual(store.getState().entities.lessons['11111111-1111-1111-111111111111'], {
      id: '11111111-1111-1111-111111111111',
      title: 'tfff',
      content: 'cont',
    })
  })
})
