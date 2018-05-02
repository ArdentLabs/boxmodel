import { Selector, createSelector } from 'reselect'

import * as utils from '../../utils'
import { pascalCase } from '../../names'
import { SchemaState, Joins } from './reducer'

export const selectSchema: Selector<any, SchemaState> = createSelector(
  utils.selector,
  (boxmodel) => boxmodel.schema
)

export const selectModelSchema = createSelector(
  selectSchema,
  (_: any, modelName: string) => pascalCase(modelName),
  (schema, typeName): { fields: string[], joins: Joins, _error?: any } => schema[typeName]
)
