import { InternalState } from './internal/reducer'
import { DataState } from './reducer'

export { default as saga } from './saga'
export { default as reducer } from './reducer'

export interface BoxModelState {
  _internal: InternalState
  data: DataState
}
