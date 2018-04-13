import * as effects from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'

import types from './types'
import * as utils from '../../utils'
import * as introspection from './introspection'
import { AnyAction } from 'redux';
import { selectTypeMap, selectSchemas } from './selectors';

interface GQLInitField {
  name: string
  type: {
    name: string
    kind: string
    ofType: {
      name: string
    }
  }
}

interface GQLInitType {
  fields: GQLInitField[]
}

// Mapping from modelName to TypeName.
export interface TypeMap {
  [fieldName: string]: string
}

// Mapping from TypeName to queryName
export interface Queries {
  [TypeName: string]: {
    one: string,
    many: string
  }
}

// Mapping from TypeName to mutationName
export interface Mutations {
  [TypeName: string]: {
    create: string,
    update: string,
    archive: string
  }
}

export interface Schemas {
  [TypeName: string]: {
    fields: string[],
    foreign: {
      [fieldName: string]: {
        type: string,
        many: boolean
      }
    }
  }
}

/** Represents the structure of `data` returned by the introspection init query. */
interface InitData {
  queries: GQLInitType
  mutations: GQLInitType
}

/** Initializes the internal redux state by figuring out which queries/mutations are related to which types. */
function* init(): SagaIterator {
  const { data } = yield effects.call(utils.query, introspection.INIT)

  const typeMap = (data as InitData).queries.fields.reduce((t, field) => {
    if (field.type.name) {
      t[field.name] = field.type.name
    }
    return t
  }, {} as TypeMap)

  const queries = (data as InitData).queries.fields.reduce((q, field) => {
    if (field.type.name) {
      // To one relationship
      q[field.type.name] = {
        ...q[field.type.name],
        one: field.name
      }
    }
    else if (field.type.kind === 'LIST') {
      // To many relationship
      q[field.type.ofType.name] = {
        ...q[field.type.ofType.name],
        many: field.name
      }
    }
    return q
  }, {} as Queries)

  const mutations = (data as InitData).mutations.fields.reduce((m, field) => {
    if (field.type.name) {
      if (field.name.startsWith('create')) {
        m[field.type.name] = {
          ...m[field.type.name],
          create: field.name
        }
      }
      else if (field.name.startsWith('update')) {
        m[field.type.name] = {
          ...m[field.type.name],
          update: field.name
        }
      }
      else if (field.name.startsWith('archive')) {
        m[field.type.name] = {
          ...m[field.type.name],
          archive: field.name
        }
      }
    }
    return m
  }, {} as Mutations)

  yield effects.put({
    type: types.INTROSPECTION_INIT,
    payload: {
      typeMap,
      queries,
      mutations
    }
  })
}

interface GQLSchemaField {
  name: string
  type: {
    name: string
    kind: string
    ofType: {
      name: string
      kind: string
      ofType: {
        name: string
        kind: string
      }
    }
  }
}

interface GQLSchemaType {
  fields: GQLSchemaField[]
}

function* schema(action: AnyAction): SagaIterator {
  const { modelName } = action.payload
  const schemas = yield effects.select(selectSchemas)
  const typeMap = yield effects.select(selectTypeMap)

  try {
    const { data } = yield effects.call(
      utils.query,
      introspection.TYPE,
      {
        typeName: typeMap[modelName]
      }
    )

  }
  catch (error) {
    yield effects.put({
      type: types.INTROSPECTION_TYPE_FAIL,
      payload: {
        error
      }
    })
  }
}

function* root() {
  yield* init()
  yield effects.takeEvery(types.INTROSPECTION_TYPE, schema)
}

export default root
