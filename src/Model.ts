import * as normalizr from 'normalizr'

export interface ModelComponents {
  Table: any
  Create: any
  Reorder: any
  Edit: any
  Detail: any
}

export class Model extends normalizr.schema.Entity {
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
