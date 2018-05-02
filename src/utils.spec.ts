import 'isomorphic-fetch'
import * as assert from 'assert'

import * as utils from './utils'
import { configure } from './config'

before(() => {
  configure({
    apiUrl: 'https://ardent-api-next.ardentlabs.io'
  })
})

describe('utils module', () => {
  it('can query', (done) => {
    utils.query(
      `
      query TestQuery($id: ID!) {
        course(id: $id) {
          id
        }
      }
    `, {
        id: '210f6454-da1b-4f6d-844f-75800dd2db4b'
      }
    )
      .then((result) => {
        assert.deepStrictEqual(result, {
          data: {
            course: {
              id: '210f6454-da1b-4f6d-844f-75800dd2db4b'
            }
          }
        })
        done()
      })
      .catch(error => done(error))
  })
})
