import { PathGenerator, Paths, Options } from '../index'

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
export function generatePaths(options: Options): Paths {
  const { modelName, pluralModelName } = options

  const create = createPathFactory(() => `add-${modelName}`)
  const edit = createPathFactory((id) => `${pluralModelName}/${id}/edit`, true)
  const fetch = createPathFactory(() => `${pluralModelName}`, true)
  const get = createPathFactory((id) => `${pluralModelName}/${id}`, true)
  const reorder = createPathFactory(() => `reorder-${pluralModelName}`)

  return {
    create,
    edit,
    fetch,
    get,
    reorder
  }
}
