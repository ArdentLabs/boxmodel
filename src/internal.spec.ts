import * as assert from 'assert'
import fetch from 'node-fetch'

import { combineReducers, createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { createInternals } from './internal'

describe('internals', () => {
  it('should initialize', done => {
    const query = (gql: string, variables?: object) =>
      fetch('https://ardent-api-next.ardentlabs.io/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: gql,
          variables,
        }),
      }).then(response => response.json())

    const { reducer, saga } = createInternals('@@boxmodel', query, [
      'category',
      'subject',
      'level',
      'part',
      'course',
      'lessonPlan',
      'problemSet',
      'problem',
      'question',
      'lessonPlanFile',
      'location',
      'category',
      'subject',
      'level',
      'part',
      'classroom',
      'lesson',
      'assignment',
      'submission',
      'enrollment',
      'instructor',
      'meeting',
      'attendee',
      'student',
      'employee',
      'familyMember',
      'familyAccount',
      'studentAccount',
      'employeeAccount',
      'article',
      'banner',
    ])

    const sagaMiddleware = createSagaMiddleware()
    const store = createStore(reducer, applyMiddleware(sagaMiddleware))
    sagaMiddleware.run(saga)

    store.subscribe(() => {
      if (store.getState().ready) {
        console.log(JSON.stringify(store.getState(), null, '  '))
        done(store.getState().error)
      }
    })
    sagaMiddleware.run(saga)
  })
})
