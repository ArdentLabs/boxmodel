import { SagaIterator } from 'redux-saga'
import * as effects from 'redux-saga/effects'

import * as utils from '../../utils'
import { camelCase, pascalCase } from '../../names'
import introspection from './introspection'
import types from './types'
import { Joins, ModelSchema } from './reducer'
import { Join } from '../data/actions'
import { selectTypeSchema } from './selectors'

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
  console.log(`Initializing ${modelName} schema`)

  try {
    // Initialize internal schema, used for creating queries
    const { data } = yield effects.call(utils.query, introspection, {
      typeName: pascalCase(modelName)
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

    console.log(`Initialized ${modelName} schema`)
    yield effects.put({
      type: types.SCHEMA_OK,
      payload: {
        [pascalCase(modelName)]: {
          fields,
          joins
        }
      }
    })
    return { fields, joins }
  }
  catch (error) {
    console.error(`Error when initializing ${modelName} schema`)
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

/**
 * Initialize the schema store so that all joined models have their schemas loaded.
 * This function should always be called before trying to query for something.
 */
export function* loadJoin(typeName: string, join: Join | true): SagaIterator {
  let schema: ModelSchema = yield effects.select((state) => selectTypeSchema(state, typeName))
  if (!schema) {
    schema = yield* initSchema(camelCase(typeName))
  }

  if (join === true) {
    return
  }
  yield effects.all(
    Object.keys(join)
      .filter((field) => {
        if (field in schema.joins) {
          return true
        }
        else {
          console.warn(`Encountered unknown join \`${typeName}.${field}\`. Skipping.`)
          return false
        }

            })
            .map((field) => effects.call(loadJoin, schema.joins[field].type, join[field]))
        )
      }
