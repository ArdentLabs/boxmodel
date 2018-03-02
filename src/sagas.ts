import { SagaIterator } from 'redux-saga'
import * as effects from 'redux-saga/effects'
import { ActionTypes } from './types'
import { Internals } from './internal'
import { GQLQuerier } from './typings'
import { toPascalCase } from './utils';
import { AnyAction } from 'redux';

export const generateSaga = <Model>(
  modelName: string,
  query: GQLQuerier,
  types: ActionTypes,
  internals: Internals
) => {
  /** The title of the model, in PascalCase. For use in query operation names. */
  const modelTitle = toPascalCase(modelName)

  function* create(action: AnyAction): SagaIterator {
    try {
      // Acquire necessary information for this query
      const { values } = action.payload
      const fields = yield effects.select(state => internals.selectors.fields(state, modelName))

      // Construct query
      const createQuery = `
        mutation Create${modelTitle}($input: Create${modelTitle}Input!) {
          create${modelTitle}(input: $input) {
            ${fields.join(' ')}
          }
        }
      `.replace(/\s+/g, ' ').trim()

      // Execute and parse query
      const response = yield effects.call(query, createQuery, { input: values })
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
}
