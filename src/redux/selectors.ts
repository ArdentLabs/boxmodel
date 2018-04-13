import { createSelector } from 'reselect'
import { selector, memoize } from '../utils'
import { Join } from './actions';

const resolveJoin = (state: any, entity: any, join: Join): any => {
  const result = { ...entity }

  for (let modelName in join) {
    if (join[modelName] && typeof join[modelName] === 'boolean') {
      // Simple join
      result[modelName] = selectors(modelName).one(state, entity[`${modelName}Id`])
    }
    else {
      // Nested join
      result[modelName] = resolveJoin(state, selectors(modelName).one(state, entity[`${modelName}Id`]), join[modelName] as Join)
    }
  }

  return result
}

const selectors = (modelName: string) => {
  const root = createSelector(
    selector,
    boxmodel => boxmodel.data[modelName]
  )

  const loading = createSelector(
    root,
    data => data._loading
  )

  const error = createSelector(
    root,
    data => data._error
  )

  const one = createSelector(
    state => state,
    root,
    (_: any, id: string, join: Join = {}) => ({ id, join }),
    (state, data, { id, join }) => resolveJoin(state, data[id], join)
  )

  return {
    root,
    loading,
    error,
    one
  }
}

export default memoize(selectors)
