import { equal } from 'assert'

import { generateTypes } from './types'

describe('type factory', () => {
  it('should work', () => {
    const experimentTypes = generateTypes('experiment')

    it('should generate correct types', () => {
      equal(experimentTypes.get, ['EXPERIMENT_GET', 'EXPERIMENT_GET_OK', 'EXPERIMENT_GET_FAIL'])
      equal(experimentTypes.create, ['EXPERIMENT_CREATE', 'EXPERIMENT_CREATE_OK', 'EXPERIMENT_CREATE_FAIL'])
      equal(experimentTypes.fetch, ['EXPERIMENT_FETCH', 'EXPERIMENT_FETCH_OK', 'EXPERIMENT_FETCH_FAIL'])
      equal(experimentTypes.update, ['EXPERIMENT_UPDATE', 'EXPERIMENT_UPDATE_OK', 'EXPERIMENT_UPDATE_FAIL'])
      equal(experimentTypes.archive, ['EXPERIMENT_ARCHIVE', 'EXPERIMENT_ARCHIVE_OK', 'EXPERIMENT_ARCHIVE_FAIL'])
    })
  })
})
