import { Reducer, combineReducers } from 'redux'
import { SagaIterator } from 'redux-saga'
import { all, Effect } from 'redux-saga/effects'
import { createSelector } from 'reselect'

import Box from './Box'
import { IDKeyTransformer } from './sagas'
import { generateInternals, InternalState } from './internal'
import { ModelState } from './reducer'
import { GQLQuerier } from './typings'

export interface BoxModelState {
  _internals: InternalState,
  data: {
    [modelName: string]: ModelState<any>
  }
}

export interface BoxModelOptions {
  /** Namespace of boxmodel actions. Defaults to `@@boxmodel`. */
  namespace: string
  /** An array of all models that this boxmodel should handle. */
  models: string[]
  /**
   * Selects the state that BoxModel will be operating on.
   * Defaults to `state => state.boxmodel`.
   */
  selector: (state: any) => BoxModelState
  /**
   * The maximum number of query histories to store.
   * THe higher this number is, the more likely the program will avoid repetitive querying, but the
   */
  maxHistory: number
  /** A function that takes in a name and returns it in its id form. Defaults to appending 'Id' to the end of the name. */
  idKeyTransform: IDKeyTransformer
  /**
   * A function that is called with a graphql query string and returns a Promise that contains the response data.
   * See documentation for `GQLQuerier` for details.
   */
  query: GQLQuerier
}

export default class BoxModel {
  private options: BoxModelOptions
  private boxes: {
    [modelName: string]: Box<any>
  }
  public saga: () => SagaIterator
  public reducer: Reducer<BoxModelState>

  constructor(options: Partial<BoxModelOptions> & { query: GQLQuerier }) {
    // Process options, with defaults.
    this.options = {
      namespace: '@@boxmodel',
      models: [],
      selector: (state: any) => state.boxmodel,
      maxHistory: 5,
      idKeyTransform: key => key + 'Id',
      ...options,
    }

    let { namespace, models, selector, maxHistory, idKeyTransform, query, } = this.options

    // Process internal state.
    let internals = generateInternals(
      namespace,
      query,
      createSelector(selector, boxmodel => boxmodel._internals),
      models
    )

    // Prepare for saga and reducer generation.
    const sagas: SagaIterator[] = [internals.saga()]
    const reducerMap: {
      [modelName: string]: Reducer<any>
    } = {
        _internals: internals.reducer
      }

    // Process each box.
    this.boxes = {}
    for (let modelName of models) {
      let box = new Box(
        namespace,
        modelName,
        internals,
        query,
        maxHistory,
        idKeyTransform
      )

      // Add box information to the boxmodel.
      this.boxes[modelName] = box
      sagas.push(box.saga())
      reducerMap[modelName] = box.reducer
    }

    // Merge sagas and reducers
    // TS huh?
    this.saga = function* () {
      yield all(sagas)
    } as any
    this.reducer = combineReducers(reducerMap)
  }
}
