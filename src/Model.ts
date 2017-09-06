import * as normalizr from 'normalizr'
import { ModelComponents } from '../index'

class Model extends normalizr.schema.Entity {
  public components: ModelComponents

  constructor(key: string, definition?: normalizr.Schema, options?: normalizr.schema.EntityOptions) {
    super(key, definition, options)
    this.components = {
      Table: null,
      Create: null,
      Reorder: null,
      Edit: null,
      Detail: null,
    }
  }

  public mount(components: ModelComponents) {
    Object.assign(this.components, components)
  }
}

export default Model
