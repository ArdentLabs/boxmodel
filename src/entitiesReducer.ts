import * as deepmerge from 'deepmerge'

import { EntitiesReducer, EntitiesState } from '../index'

const reducer: EntitiesReducer = (state = {}, action) => {
  const { type, payload } = action

  if (!type.startsWith('@@boxmodel/')) {
    return state
  }

  if (type.endsWith('ARCHIVE_OK')) {
    // Null check
    if (!payload.entityKey || !payload.id) {
      console.error('Received an archiving action, but schema and/or id are not specified.')
      return state
    }

    // Destructure to take out the archived item
    const {
      [payload.entityKey]: {
        [payload.id]: _,
        ...remaining,
      },
      ...unaffectedEntities,
    } = state
    return {
      ...unaffectedEntities,
      [payload.entityKey]: remaining,
    }
  }
  else if (type.endsWith('_OK') || type.endsWith('_UPDATE')) {
    return deepmerge(state, payload.entities) as EntitiesState
  }

  return state
}

export default reducer
