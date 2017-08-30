import { equal } from 'assert'
import { schema } from 'normalizr'

import { generateTypes } from './types'
import { Options } from '../index'

describe('generateTypes()', () => {
  const options: Options = {
    modelName: 'car',
    schema: new schema.Entity('cars'),
    apiUrl: 'localhost:3000',
    fields: `
      make
      model
    `,
    entitiesSelector: (state: any) => state.entities,
  }

  const types = generateTypes(options)

  describe('GET types', () => {
    it('should generate request type', () => equal(types.get.request, 'CAR_GET'))
    it('should generate ok type', () => equal(types.get.ok, 'CAR_GET_OK'))
    it('should generate fail type', () => equal(types.get.fail, 'CAR_GET_FAIL'))
  })

  describe('FETCH types', () => {
    it('should generate request type', () => equal(types.fetch.request, 'CAR_FETCH'))
    it('should generate ok type', () => equal(types.fetch.ok, 'CAR_FETCH_OK'))
    it('should generate fail type', () => equal(types.fetch.fail, 'CAR_FETCH_FAIL'))
  })

  describe('CREATE types', () => {
    it('should generate request type', () => equal(types.create.request, 'CAR_CREATE'))
    it('should generate ok type', () => equal(types.create.ok, 'CAR_CREATE_OK'))
    it('should generate fail type', () => equal(types.create.fail, 'CAR_CREATE_FAIL'))
  })

  describe('UPDATE types', () => {
    it('should generate request type', () => equal(types.update.request, 'CAR_UPDATE'))
    it('should generate ok type', () => equal(types.update.ok, 'CAR_UPDATE_OK'))
    it('should generate fail type', () => equal(types.update.fail, 'CAR_UPDATE_FAIL'))
  })

  describe('ARCHIVE types', () => {
    it('should generate request type', () => equal(types.archive.request, 'CAR_ARCHIVE'))
    it('should generate ok type', () => equal(types.archive.ok, 'CAR_ARCHIVE_OK'))
    it('should generate fail type', () => equal(types.archive.fail, 'CAR_ARCHIVE_FAIL'))
  })
})
