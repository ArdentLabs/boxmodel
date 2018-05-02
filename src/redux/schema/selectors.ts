import { Selector, createSelector } from 'reselect'

import * as utils from '../../utils'
import { pascalCase } from '../../names'
import { selectSchema } from '../selectors'
import { SchemaState, Joins } from './reducer'

export const selectModelSchema = createSelector(
  selectSchema,
  (_: any, modelName: string) => pascalCase(modelName),
  (schema, typeName): { fields: string[], joins: Joins, _error?: any } => schema[typeName]
)
