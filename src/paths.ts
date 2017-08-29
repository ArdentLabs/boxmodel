import { PathFactory, Paths } from '../index'

const createPath = (path: string, absolute?: boolean): PathFactory => (params) => {
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
export function generatePaths(
  name: string, // Name of the model
  pluralName: string, // Plural form of model's name
): Paths {
  const create = createPath(`add-${name}`)
  const edit = createPath(`${pluralName}/${name}Id/edit`, true)
  const fetch = createPath(`${pluralName}`, true)
  const get = createPath(`${pluralName}/${name}Id`, true)
  const reorder = createPath(`reorder-${pluralName}`)

  return {
    create,
    edit,
    fetch,
    get,
    reorder
  }
}
