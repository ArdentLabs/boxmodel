import { createSelector } from 'reselect'
import { selector, memoize } from '../utils'
import { Join } from './actions'
import { selectQueries, selectSchemas } from './internal/selectors'

const resolveJoin = (state: any, modelName: string, entity: any, join: Join): any => {
  const result = { ...entity }


  for (const field in join) {
    const queries = selectQueries(state)
    const joinModelName = queries[selectSchemas(state)[modelName].foreign[field].type].one as string
    console.log(field, joinModelName)

    if (join[field] && typeof join[field] === 'boolean') {
      // Simple join
      result[field] = selectors(joinModelName).one(state, entity[`${field}Id`])
    }
    else {
      // Nested join
      result[field] = resolveJoin(
        state,
        joinModelName,
        selectors(field).one(state, entity[`${field}Id`]),
        join[field] as Join
      )
    }
  }

  return result
}

const selectors = (modelName: string) => {
  const root = createSelector(
    selector,
    (boxmodel) => boxmodel.data[modelName]
  )

  const loading = createSelector(
    root,
    (data) => data._loading
  )

  const error = createSelector(
    root,
    (data) => data._error
  )

  const one = createSelector(
    (state) => state,
    root,
    (_: any, id: string, join: Join = {}) => ({ id, join }),
    (state, data, { id, join }) => resolveJoin(state, modelName, data[id], join)
  )

  return {
    root,
    loading,
    error,
    one
  }
}

export default memoize(selectors)
