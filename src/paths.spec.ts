import { deepEqual } from 'assert'

import createMemoryHistory from 'history/createMemoryHistory'

import { generatePaths } from './paths'

describe('path generator', () => {
  const history = createMemoryHistory()

  it('should generate paths correctly', () => {
    deepEqual(generatePaths('foo', 'foos'), {
      create: 'add-foo',
      edit: '/foo/:foedit'
    })
  })
})
