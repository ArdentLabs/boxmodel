import { equal } from 'assert'
import { schema } from 'normalizr'

import { namespace, generateTypes } from './types'
import { Options } from '../index'

describe('generateTypes()', () => {
  const options: Options = {
    modelName: 'car',
    schema: new schema.Entity('cars'),
    apiUrl: 'localhost:3000',
    entitiesSelector: (state: any) => state.entities,
  }

  const types = generateTypes(options)

  describe('GET types', () => {
    it('should generate request type', () => equal(types.get.request, `${namespace}/CAR_GET`))
    it('should generate ok type', () => equal(types.get.ok, `${namespace}/CAR_GET_OK`))
    it('should generate fail type', () => equal(types.get.fail, `${namespace}/CAR_GET_FAIL`))
  })

  describe('FETCH types', () => {
    it('should generate request type', () => equal(types.fetch.request, `${namespace}/CAR_FETCH`))
    it('should generate ok type', () => equal(types.fetch.ok, `${namespace}/CAR_FETCH_OK`))
    it('should generate fail type', () => equal(types.fetch.fail, `${namespace}/CAR_FETCH_FAIL`))
  })

  describe('CREATE types', () => {
    it('should generate request type', () => equal(types.create.request, `${namespace}/CAR_CREATE`))
    it('should generate ok type', () => equal(types.create.ok, `${namespace}/CAR_CREATE_OK`))
    it('should generate fail type', () => equal(types.create.fail, `${namespace}/CAR_CREATE_FAIL`))
  })

  describe('UPDATE types', () => {
    it('should generate request type', () => equal(types.update.request, `${namespace}/CAR_UPDATE`))
    it('should generate ok type', () => equal(types.update.ok, `${namespace}/CAR_UPDATE_OK`))
    it('should generate fail type', () => equal(types.update.fail, `${namespace}/CAR_UPDATE_FAIL`))
  })

  describe('ARCHIVE types', () => {
    it('should generate request type', () => equal(types.archive.request, `${namespace}/CAR_ARCHIVE`))
    it('should generate ok type', () => equal(types.archive.ok, `${namespace}/CAR_ARCHIVE_OK`))
    it('should generate fail type', () => equal(types.archive.fail, `${namespace}/CAR_ARCHIVE_FAIL`))
  })
})
