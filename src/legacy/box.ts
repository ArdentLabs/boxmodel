import { Actions } from './actions'
import { Selectors } from './selectors'
import { Paths } from './paths'
import { Types } from './types'

export interface Box<Model> {
  $$isBoxModel: true
  actions: Actions<Model>
  modelName: string
  modelTitle: string
  paths: Paths
  selectors: Selectors
  types: Types
}
