import { InternalState } from './internal/reducer'
import { DataState } from './reducer';

export interface BoxModelState {
  _internal: InternalState
  data: DataState
}
