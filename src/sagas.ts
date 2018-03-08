import { SagaIterator } from 'redux-saga'
import * as effects from 'redux-saga/effects'
import { ActionTypes, createMergeType } from './types'
import { Internals, ModelLink } from './internal'
import { GQLQuerier, Join } from './typings'
import { toPascalCase } from './utils';
import { AnyAction } from 'redux';

export type IDKeyTransformer = (key: string) => string

export const generateSaga = <Model>(
  namespace: string,
  modelName: string,
  types: ActionTypes,
  internals: Internals,
  query: GQLQuerier,
  idKeyTransform: IDKeyTransformer
) => {
  /** The title of the model, in PascalCase. For use in query operation names. */
  const modelTitle = toPascalCase(modelName)

  function* create(action: AnyAction): SagaIterator {
    try {
      // Extract necessary information for this query
      const { values } = action.payload
      const fields = yield effects.select(internals.selectors.fields, modelName)

      // Execute query
      const createQuery = `
        mutation Create${modelTitle}($input: Create${modelTitle}Input!) {
          create${modelTitle}(input: $input) {
            ${fields.join(' ')}
          }
        }
      `.replace(/\s+/g, ' ').trim()
      const response = yield effects.call(query, createQuery, { input: values })

      // Parse and store query results
      if (response.errors) {
        throw new Error(JSON.stringify(response.errors))
      }
      const modelData = response.data[`create${modelTitle}`]
      yield effects.put({
        type: types.create.ok,
        payload: {
          entity: modelData
        }
      })
    }
    catch (error) {
      yield effects.put({
        type: types.create.fail,
        payload: {
          reason: error.toString()
        }
      })
    }
  }

  /**
   * Given the current model name and the join object, returns the query that should be inserted into the body.
   * This saga should return the string in the following format:
   * ```
   * id
   * ...(rest of fields)
   * {joinedModel} {
   *   id
   *   ...(rest of fields)
   *   ...(any other joins necessary)
   * }
   * ```
   * Note that it does not include its own model name.
   */
  function* joinFields(modelName: string, join: Join): SagaIterator {
    const ownFields: string[] = yield effects.select(internals.selectors.fields, modelName)
    const linkedModels: { [modelName: string]: ModelLink } = yield effects.select(internals.selectors.links, modelName)
    const joinedFields: string[] = []

    for (let joinModelName in join) {
      if (joinModelName in linkedModels) {
        // Recognized field, can join.
        let innerFields: string

        if (join[joinModelName] === true || typeof join[joinModelName] === 'string') {
          // Simple join
          innerFields = yield* joinFields(joinModelName, {})
        }
        else {
          // Nested join
          innerFields = yield* joinFields(joinModelName, join[joinModelName] as Join)
        }

        joinedFields.push(`
          ${joinModelName} {
            ${innerFields}
          }
        `)
      }
      else {
        // Wrong use of join.
        throw new Error(`Cannot join \`${modelName}\`.\`${joinModelName}\`: field not recognized.\nAvailable fields: ${Object.keys(linkedModels).map(fieldName => `\`${fieldName}\``).join(', ')}`)
      }
    }

    return `
      ${ownFields.join(' ')}
      ${joinedFields.join(' ')}
    `
  }

  /**
   * Given a model's data, normalize and distribute it.
   *
   * @param modelName The current model name being processed
   * @param data The data to distribute
   */
  function* distribute(modelName: string, data: any): SagaIterator {
    const linkedModels: { [modelName: string]: ModelLink } = yield effects.select(internals.selectors.links, modelName)

    // Process data, distribute submodels as needed.
    const modelData: {
      [field: string]: any
    } = {}
    for (let field in data) {
      if (field in linkedModels) {
        // Normalize and distribute submodel.
        yield* distribute(linkedModels[field].modelName, data[field])
        modelData[idKeyTransform(field)] = data[field].id
      }
      else {
        // Just a humble field.
        modelData[field] = data[field]
      }
    }

    // Data processed, put result in store.
    yield effects.put({
      type: createMergeType(namespace, modelName)
    })
  }

  function* one(action: AnyAction): SagaIterator {
    try {
      // Extract necessary information for this query
      const { id, join, force } = action.payload
      const fields: string = yield* joinFields(modelName, join)

      // Execute query
      const oneQuery = `
        query FindOne${modelTitle}($id: ID!) {
          ${fields}
        }
      `.replace(/\s+/g, ' ').trim()
      const response = yield effects.call(query, oneQuery, { id })

      // Parse and store query results
      if (response.errors) {
        throw new Error(JSON.stringify(response.errors))
      }
      yield* distribute(modelName, response.data[modelName])
    }
    catch (error) {
      yield effects.put({
        type: types.one.fail,
        payload: {
          reason: error.toString()
        }
      })
    }
  }

  function* root(): SagaIterator {
    yield effects.all([
      effects.takeLatest(types.create.request, create),
      effects.takeLatest(types.one.request, one)
    ])
  }

  return root
}
