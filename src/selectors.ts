import { createSelector } from 'reselect'
import { State, JoinWith, Props, TransformFunc, EntitiesSelector, Selectors } from '../index'
import sort from 'sort-obj-array'

/**
 * This is a recursive funciton that joins a model with child models.
 *
 * Used in `getJoinedModel` and `getJoinedModels`.
 *
 * @param  {object} model
 *         The model to join
 * @param  {object} joinWith
 *         An object specifying which models will be joind within the
 *         original
 *
 *         ```
 *         joinWith = {
 *           course: {           // nesting! course also gets joind
 *             lessonPlan: true, // regular join
 *           },
 *           student: 'user',    // custom join with different model name
 *           enrollments: true,  // array join
 *         }
 *         ```
 *
 * @param  {object} state
 *         Redux state
 * @return {object}
 *         The final model object, with all joined models merged in
 */
function join<Model>(model: any, joinWith: JoinWith | undefined, state: State) {
  if (!model || !joinWith) {
    return model
  }

  interface JoinResult {
    [key: string]: any
  }

  const result: JoinResult = {}

  for (const key of Object.keys(joinWith)) {
    const value = joinWith[key]

    //
    // Can be simplified if we use the schemas created by Thinky.
    // Although this requires both the backend and frontend repos to be
    // combined.
    //
    // I guess we could even use Normalizr schemas... meh, to be continued
    //

    const submodel = model[key] || model[`${key}Id`]

    if (submodel) {
      if (key.endsWith('s') && Array.isArray(submodel)) {
        // Join an array
        result[key] = submodel.map((id) => {
          const entity = state[key].entities[id]

          // Nested object recursion
          if (typeof value === 'object') {
            return join<Model>(entity, value, state)
          }

          return entity
        })
      } else {
        switch (typeof value) {
          case 'object':
            if ((value as JoinWith).$$isBoxModel) {
              // State data, used in ModelEdit
              result[key] = state[`${key}s`].entities[submodel]
            } else {
              // Nested object recursion
              result[key] = join<Model>(submodel, value as JoinWith, state)
            }
            break
          case 'string':
            // Custom Redux store location
            result[key] = state[`${value}s`].entities[submodel]
            break
          case 'boolean':
            // Simply join from Redux store with default key name
            result[key] = state[`${key}s`].entities[submodel]
            break
          default:
            throw new Error(`Value type '${typeof value}'not recognized`)
        }
      }
    }
  }

  return Object.assign({}, model, result)
}

/**
 * Generates functions for selecting certain portions of the Redux state for a
 * model type.
 */
export function generateSelectors<Model>(modelName: string, entitiesSelector: EntitiesSelector): Selectors<Model> {
  const path = modelName

  /**
   * Get the identifier of the requested model
   */
  const getId = (state: State, props: Props<Model>) => {
    if (props.id) {
      return props.id
    }
    if (props.match && props.match.params && props.match.params.id) {
      return props.match.params.id
    }
    if (state.router && state.router.location && state.router.location.pathname) {
      const tokens = state.router.location.pathname.split('/')
      if (tokens.length === 3) {
        // URL matches /:modelName/:id
        return tokens[3]
      }
    }
    throw new Error('ID not found')
  }

  /**
   * Get the loading state of the requested model type
   */
  const getLoading = (state: State) => state[path] && state[path].loading

  /**
   * Get all the entities of the requested model type
   */
  const getEntities = createSelector(
    entitiesSelector,
    (entities) => entities[path]
  )

  /**
   * Get the requested model
   */
  const getModel = createSelector(
    getId,
    getEntities,
    (id, entities) => entities[id]
  )

  /**
   * Get the join parameters (props.joinWith)
   */
  const getJoinWith = (_: State, props: Props<Model>) => props.joinWith

  /**
   * Get the requested model, joind with the data within
   */
  const getJoinedModel = createSelector(
    getModel,
    getJoinWith,
    (state) => state,
    (model, joinWith, state) => {
      const result = join<Model>(model, joinWith, state)
      return result
    }
  )

  /**
   * Get an array of models.
   */
  const getModels = createSelector(
    getEntities,
    (entities) => Object.keys(entities)
      .map((id) => entities[id])
      .filter((obj) => !obj.archivedOn)
    // TODO (Sam): Add option for viewing archived models.
  )

  /**
   * Get an array of models with joind sub-models.
   */
  const getJoinedModels = createSelector(
    getModels,
    getJoinWith,
    (state) => state,
    (models, joinWith, state) =>
      models.map((model) =>
        join<Model>(model, joinWith, state)
      )
  )

  /**
   * Get any desired mutation functions (props.mutate)
   */
  const getTransformations = (_: State, props: Props<Model>) => {
    const { transform } = props
    return transform ? [transform] : []
  }

  const getTransformedModels = createSelector(
    getJoinedModels,
    getTransformations,
    (models, transformations) => {
      if (transformations.length) {
        return models.map((model) =>
          transformations.reduce((prev, curr: TransformFunc<Model>) => curr(prev), model)
        )
      }
      return models
    }
  )

  /**
   * Get provided filtering parameters
   */
  const getPropFilters = (_: State, props: Props<Model>) => props.filters

  /**
   * Generate the filtering parameters
   */
  const getFilters = createSelector(
    getPropFilters,
    (propFilters) => {
      const filters = []

      if (Array.isArray(propFilters)) {
        filters.push(...propFilters)
      }

      return filters
    }
  )

  /**
   * Get an array of models.
   * Joined and filtered.
   */
  const getFilteredModels = createSelector(
    getTransformedModels,
    getFilters,
    (models, filters) =>
      models.filter((model) => {
        for (const filter of filters) {
          if (!filter(model, models)) {
            return false
          }
        }
        return true
      })
  )

  /**
   * Get the sorting parameters (props.sortBy)
   */
  const getSortBy = (state: State, props: Props<Model>) => {
    const { sortBy } = props
    return typeof sortBy === 'function'
      ? (a: Model, b: Model) => sortBy(a, b, state)
      : sortBy
  }

  /**
   * Get an array of models.
   * Joined, filtered, and sorted.
   */
  const getSortedModels = createSelector(
    getFilteredModels,
    getSortBy,
    (models, sortBy) => {
      switch (typeof sortBy) {
        case 'object':
        case 'string':
        case 'function':
          return sort(models, sortBy)
        default:
          return models
      }
    }
  )

  return {
    id: getId,
    loading: getLoading,
    model: getJoinedModel,
    models: getSortedModels,
    filters: getFilters,
  }
}
