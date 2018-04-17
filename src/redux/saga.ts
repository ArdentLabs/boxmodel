import { AnyAction } from 'redux';
import { SagaIterator } from 'redux-saga'
import * as effects from 'redux-saga/effects'

import * as utils from '../utils'
import * as internal from './internal'
import * as introspection from './internal/introspection'

import types, { isInit } from './types'
import { selectSchemas, selectTypeMap, selectQueries } from './internal/selectors';
import actions from './actions';

const dev = process.env.NODE_ENV === 'development'

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

const getRootType = (type: GQLType): { type: GQLType, many: boolean } => {
  let many = false
  while (type.ofType) {
    if (type.kind === 'LIST') {
      many = true
    }
    type = type.ofType
  }
  return { type, many }
}

function* model(action: AnyAction): SagaIterator {

  const { modelName } = action.payload

  const schemas = yield effects.select(selectSchemas)
  const queries = yield effects.select(selectQueries)
  const typeMap = yield effects.select(selectTypeMap)

  if (modelName in schemas) {
    // Already initialzed!
    return
  }
  else {
    console.log('Initializing saga for ' + modelName)
    // Initialize internal schema, used for creating queries
    const { data: { __type } } = yield effects.call(utils.query, introspection.TYPE, {
      typeName: typeMap[modelName]
    })
    const attributes = __type.fields as GQLField[]

    // attributes - everything; fields - not joins; foerign - joins. It's a little confusing.
    const fields = []
    const foreign: {
      [modelName: string]: {
        type: string
        many: boolean
      }
    } = {}

    // Separate attributes into fields and foreign
    for (let attribute of attributes) {
      let { type, many } = getRootType(attribute.type)

      switch (type.kind) {
        case 'OBJECT':
        case 'LIST':
        case 'NON_NULL': {
          // Complex object
          // Save to foreign types and initialize if needed
          try {
            const foreignModelName = queries[type.name].one
            foreign[foreignModelName] = {
              type: type.name,
              many
            }
            break
          }
          catch (error) {
            console.error(`Failed to resolve type of ${typeMap[modelName]}.${type.name.substring(0, 1).toLowerCase()}${type.name.substring(1)}. Resorting to simple field handling.`)
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

    // Save introspection result.
    yield effects.put({
      type: internal.types.INTROSPECTION_TYPE,
      payload: {
        [modelName]: {
          fields,
          foreign
        }
      }
    })

    effects.spawn

    // If submodels are not initialized, initialize those.
    yield effects.all(Object.keys(foreign)
      .filter(foreignModelName => !(foreignModelName in schemas))
      .map(foreignModelName => effects.call(model, actions(foreignModelName).init()))
    )
  }

  console.log(`Schema for ${modelName} initialized. Starting saga.`)

  function* one(action: AnyAction): SagaIterator {
    console.log('one action caught by saga.')
  }

  function* many(action: AnyAction): SagaIterator {
    console.log('many action caught by saga.')
  }

  function* create(action: AnyAction): SagaIterator {
    console.log('create action caught by saga.')
  }

  yield effects.all([
    effects.takeLatest(types(modelName).one.request, one)
  ])
}

function* root(): SagaIterator {
  yield* internal.saga()
  yield effects.takeEvery((action: AnyAction) => isInit(action.type), model)
}

export default root;
