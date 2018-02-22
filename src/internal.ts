import { Reducer } from 'redux'

export interface InternalState {
  ready: boolean,
  fields: {
    [modelName: string]: string[]
  }
}

const defaultState: InternalState = {
  ready: false,
  fields: {}
}

export const createInternalReducer: (
  namespace: string
) => Reducer<InternalState> = namespace => (state = defaultState, action) => {
  const { type, payload } = action

  switch (type) {
    case `${namespace}/READY`: {
      return {
        ready: true,
        fields: {}
      }
    }
    default: {
      return state
    }
  }
}
