import { SagaIterator } from 'redux-saga'
import * as effects from 'redux-saga/effects'

import * as utils from '../../utils'
import { pascalCase, camelCase } from '../../names'
import introspection from './introspection'
import types from './types'
import { Joins } from './reducer'

type GQLKind = 'SCALAR' | 'OBJECT' | 'INTERFACE' | 'UNION' | 'ENUM' | 'INPUT_OBJECT' | 'LIST' | 'NON_NULL'

interface GQLType {
  name: string
  kind: GQLKind
  ofType: GQLType | null
}

interface GQLField {
  name: string
  type: GQLType
}

/**
 * Utility function for stripping non-null and list types.
 */
const getRootType = (type: GQLType): { type: GQLType, list: boolean } => {
  let list = false
  while (type.ofType) {
    if (type.kind === 'LIST') {
      list = true
    }
    type = type.ofType
  }
  return { type, list }
}

/**
 * Initialize the schema for a certain model.
 * It will not recursively initialize schema for any other models.
 * It does not check if the model has been initialized already, instead will always overwrite the current schema.
 */
export function* initSchema(modelName: string): SagaIterator {
  console.log(`Initializing schema for ${pascalCase(modelName)}`)

  try {
    // Initialize internal schema, used for creating queries
    const { data } = yield effects.call(utils.query, introspection, {
      typeName: modelName.substring(0, 1).toUpperCase() + modelName.substring(1)
    })
    const attributes = data.__type.fields as GQLField[]

    const fields = []
    const joins: Joins = {}

    // Separate attributes into fields and foreign
    for (const attribute of attributes) {
      const { type, list } = getRootType(attribute.type)

      switch (type.kind) {
        case 'OBJECT':
        case 'LIST':
        case 'NON_NULL': {
          // Complex object
          // Save to foreign types and initialize if needed
          try {
            joins[attribute.name] = {
              type: type.name,
              many: list
            }
            break
          }
          catch (error) {
            console.error(
              `Failed to resolve type of ${pascalCase(modelName)}.${camelCase(type.name)}.`,
              'Resorting to simple field handling.'
            )
          }
        }
        case 'SCALAR':
        case 'INTERFACE':
        case 'UNION':
        case 'ENUM':
        case 'INPUT_OBJECT': {
          // Assume simple object
          fields.push(attribute.name)
          break
        }
      }
    }

    console.log(`Schema for ${pascalCase(modelName)} initialized.`)
    yield effects.put({
      type: types.SCHEMA_OK,
      payload: {
        [pascalCase(modelName)]: {
          fields,
          joins
        }
      }
    })
  }
  catch (error) {
    console.error(`Error when initializing schema for ${pascalCase(modelName)}.`)
    yield effects.put({
      type: types.SCHEMA_FAIL,
      payload: {
        [pascalCase(modelName)]: {
          _error: error
        }
      }
    })
  }
}
