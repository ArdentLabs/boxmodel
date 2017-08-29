import { equal } from 'assert'
import { schema } from 'normalizr'

import { generateTypes, getRequest, getOk, getFail } from './types'
import { Options } from '../index'

describe('generateTypes()', () => {
  const options: Options = {
    modelName: 'car',
    pluralModelName: 'cars',
    schema: new schema.Entity('cars'),
    apiUrl: 'localhost:3000',
    fields: `
      make
      model
    `,
  }

  const types = generateTypes(options)

  describe('GET types', () => {
    it('should generate request type', () => equal(getRequest(types.get), 'CAR_GET'))
    it('should generate ok type', () => equal(getOk(types.get), 'CAR_GET_OK'))
    it('should generate fail type', () => equal(getFail(types.get), 'CAR_GET_FAIL'))
  })

  describe('FETCH types', () => {
    it('should generate request type', () => equal(getRequest(types.fetch), 'CAR_FETCH'))
    it('should generate ok type', () => equal(getOk(types.fetch), 'CAR_FETCH_OK'))
    it('should generate fail type', () => equal(getFail(types.fetch), 'CAR_FETCH_FAIL'))
  })

  describe('CREATE types', () => {
    it('should generate request type', () => equal(getRequest(types.create), 'CAR_CREATE'))
    it('should generate ok type', () => equal(getOk(types.create), 'CAR_CREATE_OK'))
    it('should generate fail type', () => equal(getFail(types.create), 'CAR_CREATE_FAIL'))
  })

  describe('UPDATE types', () => {
    it('should generate request type', () => equal(getRequest(types.update), 'CAR_UPDATE'))
    it('should generate ok type', () => equal(getOk(types.update), 'CAR_UPDATE_OK'))
    it('should generate fail type', () => equal(getFail(types.update), 'CAR_UPDATE_FAIL'))
  })

  describe('ARCHIVE types', () => {
    it('should generate request type', () => equal(getRequest(types.archive), 'CAR_ARCHIVE'))
    it('should generate ok type', () => equal(getOk(types.archive), 'CAR_ARCHIVE_OK'))
    it('should generate fail type', () => equal(getFail(types.archive), 'CAR_ARCHIVE_FAIL'))
  })
})
