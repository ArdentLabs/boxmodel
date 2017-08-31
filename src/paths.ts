import { PathGenerator, Paths } from '../index'

type PathFactory = (getPath: PathGenerator, absolute?: boolean) => PathGenerator

const createPathFactory: PathFactory = (getPath, absolute) => (id) => {
  let path = getPath(id)

  if (absolute && !path.startsWith('/')) {
    path = `/${path}`
  }
  else if (!absolute && path.startsWith('/')) {
    path = path.substring(1)
  }

  // End in slash to allow more consistent and predictable behaviour
  if (!path.endsWith('/')) {
    path = `${path}/`
  }

  return path
}

/**
 * Generate paths for client-side operations.
 */
export function generatePaths(modelName: string): Paths {
  const create = createPathFactory(() => `add-${modelName}`)
  const edit = createPathFactory((id) => `${modelName}/${id}/edit`, true)
  const fetch = createPathFactory(() => `${modelName}`, true)
  const get = createPathFactory((id) => `${modelName}/${id}`, true)
  const reorder = createPathFactory(() => `reorder-${modelName}`)

  return {
    create,
    edit,
    fetch,
    get,
    reorder
  }
}
