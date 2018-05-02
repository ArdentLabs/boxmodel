import { createSelector, Selector } from 'reselect'

import * as utils from '../utils'
import { SchemaState } from './schema'

export const selectSchema: Selector<any, SchemaState> = createSelector(
  utils.selector,
  (boxmodel) => boxmodel.schema
)
