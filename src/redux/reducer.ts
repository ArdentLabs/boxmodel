import { combineReducers, Reducer } from 'redux'

import { reducer as schemaReducer, SchemaState } from './schema'

export interface BoxModelState {
  schema: SchemaState
}

const reducer: Reducer<BoxModelState> = combineReducers({
  schema: schemaReducer
})

export default reducer
