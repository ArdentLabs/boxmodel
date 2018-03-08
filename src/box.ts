import { ActionCreators, generateActionCreators } from './actions'
import { Internals } from './internal'
import { ActionTypes, generateTypes } from './types'
import { GQLQuerier } from './typings'
import { IDKeyTransformer, generateSaga } from './sagas';
import { SagaIterator } from 'redux-saga';
import { Reducer } from 'redux';
import { ModelState, generateReducer } from './reducer';

export default class Box<Model> {
  private types: ActionTypes
  public actions: ActionCreators<Model>
  public saga: () => SagaIterator
  public reducer: Reducer<ModelState<Model>>

  constructor(
    namespace: string,
    modelName: string,
    internals: Internals,
    query: GQLQuerier,
    maxHistory: number,
    idKeyTransform: IDKeyTransformer
  ) {
    this.types = generateTypes(namespace, modelName)
    this.actions = generateActionCreators(this.types)
    this.saga = generateSaga(
      namespace,
      modelName,
      this.types,
      internals,
      query,
      idKeyTransform
    )
    this.reducer = generateReducer(this.types, maxHistory)
  }
}
