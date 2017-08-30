import { ok } from 'assert'
import BoxModel from './index'
import { InputOptions } from '../index'
import { schema } from 'normalizr'

describe('generate()', () => {
  const options: InputOptions = {
    modelName: 'car',
    schema: new schema.Entity('cars'),
  }

  const box = new BoxModel({ apiUrl: 'localhost:3000' })
  const res = box.generate(options)

  it('has $$isBoxModel', () => {
    ok(res.$$isBoxModel)
  })
  it('has actions', () => {
    ok(res.actions)
  })
  it('has paths', () => {
    ok(res.paths)
  })
  it('has reducer', () => {
    ok(res.reducer)
  })
  it('has routes', () => {
    ok(res.routes)
  })
  it('has sagas', () => {
    ok(res.sagas)
  })
  it('has selectors', () => {
    ok(res.selectors)
  })
  it('has types', () => {
    ok(res.types)
  })
})
