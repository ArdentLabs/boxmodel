import { AnyAction } from 'redux'
import { SagaIterator, Buffer } from 'redux-saga'
import * as effects from 'redux-saga/effects'

import * as utils from '../utils'
import * as internal from './internal'
import * as introspection from './internal/introspection'

import types, { init } from './types'
import { selectQueries, selectSchemas, selectTypeMap } from './internal/selectors'
import actions from './actions'

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

function* model(a: AnyAction): SagaIterator {

  const { modelName } = a.payload

  const schemas = yield effects.select(selectSchemas)
  const queries = yield effects.select(selectQueries)
  const typeMap = yield effects.select(selectTypeMap)

  if (modelName in schemas) {
    // Already initialzed!
    return
  }
  console.log('Initializing saga for ' + modelName)
  yield effects.put({
    type: internal.types.INTROSPECTION_TYPE,
    payload: { modelName }
  })

  // Prepare channels for later use
  const channels = {
    one: yield effects.actionChannel(types(modelName).one.request),
    many: yield effects.actionChannel(types(modelName).many.request),
    create: yield effects.actionChannel(types(modelName).create.request),
    update: yield effects.actionChannel(types(modelName).update.request),
    archive: yield effects.actionChannel(types(modelName).archive.request)
  }

  // Initialize internal schema, used for creating queries
  const { data } = yield effects.call(utils.query, introspection.TYPE, {
    typeName: typeMap[modelName]
  })
  const attributes = data.__type.fields as GQLField[]

  // attributes - everything; fields - not joins; foreign - joins. It might be a little confusing.
  const fields = []
  const foreign: {
    [modelName: string]: {
      type: string
      many: boolean
    }
  } = {}

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
          foreign[attribute.name] = {
            type: type.name,
            many: list
          }
          break
        }
        catch (error) {
          console.error(`Failed to resolve type of ${typeMap[modelName]}.${type.name.substring(
            0,
            1
          ).toLowerCase()}${type.name.substring(1)}. Resorting to simple field handling.`)
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
    type: internal.types.INTROSPECTION_TYPE_OK,
    payload: {
      [modelName]: {
        fields,
        foreign
      }
    }
  })

  // If submodels are not initialized, initialize those.
  yield effects.all(
    Object.values(foreign)
      .map(({ type }) => queries[type] && queries[type].one)
      .filter((name) => name && !(name in schemas))
      .map((name) => effects.put(actions(name).init()))
    // .map((name) => effects.call(model, actions(name).init()))
  )

  function* one(action: AnyAction): SagaIterator {
    console.log('one action caught by saga.')
  }

  function* many(action: AnyAction): SagaIterator {
    console.log('many action caught by saga.')
  }

  function* create(action: AnyAction): SagaIterator {
    console.log('create action caught by saga.')
  }

  function* update(action: AnyAction): SagaIterator {
    console.log('update action caught by saga.')
  }

  function* archive(action: AnyAction): SagaIterator {
    console.log('archive action caught by saga.')
  }

  yield effects.all([
    effects.takeLatest(channels.one, one),
    effects.takeLatest(channels.many, many),
    effects.takeLatest(channels.create, create),
    effects.takeLatest(channels.update, update),
    effects.takeLatest(channels.archive, archive)
  ])
}

const initBuffer = (): Buffer<AnyAction> => {
  const queue: AnyAction[] = []

  return {
    isEmpty: () => queue.length === 0,
    put: (message) => {
      for (let action of queue) {
        if (action.payload.modelName === message.payload.modelName) {
          return
        }
      }
      queue.push(message)
    },
    take: () => queue.shift(),
    flush: () => {
      while (queue.length > 0) {
        queue.pop()
      }
    }
  }
}

function* root(): SagaIterator {
  const initChannel = yield effects.actionChannel(init(), initBuffer())
  yield* internal.saga()
  yield effects.takeEvery(initChannel, model)
}

export default root
