import { Paths } from '../index'

const resolvePath = (path: string, absolute: boolean = true): string => {
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
  param: string, // Name of the URL parameter to select when getting
): Paths {
  const fetch = resolvePath(`/${pluralName}/`)
  const create = resolvePath(`add-${name}/`)
  const get = resolvePath(`/${pluralName}/${name}Id/`)
  const edit = resolvePath('/edit/')

  return { fetch, create, get, edit }
}
