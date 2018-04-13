import { createSelector, Selector } from 'reselect'

import { selector } from '../../utils'
import { InternalState } from './reducer'
import { Mutations, Queries, TypeMap, Schemas } from './saga'

export const selectInternal: Selector<any, InternalState> = createSelector(
  selector,
  (boxmodel) => boxmodel._internal
)

export const selectTypeMap: Selector<any, TypeMap> = createSelector(
  selectInternal,
  (internal) => internal.typeMap
)

export const selectQueries: Selector<any, Queries> = createSelector(
  selectInternal,
  (internal) => internal.queries
)

export const selectMutations: Selector<any, Mutations> = createSelector(
  selectInternal,
  (internal) => internal.mutations
)

export const selectSchemas: Selector<any, Schemas> = createSelector(
  selectInternal,
  (internal) => internal.schemas
)
