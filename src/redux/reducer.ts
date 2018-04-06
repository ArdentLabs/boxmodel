/**
 * The state of data for a single model.
 */
import { AnyAction, combineReducers, ReducersMapObject } from 'redux'
import createTypes, { init } from './types'

export interface ModelState {
  loading: boolean
  error: boolean
  
  [id: string]: any
}

/** The state structure for the entire data storage */
export interface DataState {
  [modelName: string]: ModelState
}

const defaultState: DataState = {}

const reducers: ReducersMapObject = {}
let reducer = combineReducers(reducers)

/** Generates and adds a reducer to the reducer map. */
const addReducer = (modelName: string) => {
  const defaultModelState: ModelState = {
    loading: false,
    error: false
  }
  const types = createTypes(modelName)
  
  reducers[modelName] = (state: ModelState = defaultModelState, action: AnyAction) => {
    const { type, payload } = action
    
    switch (type) {
      case (types.one.request):
      case (types.many.request):
      case (types.create.request):
      case (types.update.request):
      case (types.archive.request):
        return {
          ...state,
          loading: true,
          error: false
        }
      
      case (types.one.ok):
      case (types.many.ok):
      case (types.create.ok):
      case (types.update.ok):
      case (types.archive.ok):
        return {
          ...state,
          loading: false,
          error: false
        }
      
      case (types.one.fail):
      case (types.many.fail):
      case (types.create.fail):
      case (types.update.fail):
      case (types.archive.fail):
        return {
          ...state,
          loading: false,
          error: true
        }
      
      case types.merge:
        return {
          ...state,
          ...payload.data
        }
    }
  }
  
  reducer = combineReducers(reducers)
}

export default (state: DataState = defaultState, action: AnyAction) => {
  if (action.type === init()) {
    addReducer(action.payload.modelName)
  }
  
  return reducer(state, action)
}
