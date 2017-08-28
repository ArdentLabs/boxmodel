import { Path, PathFactory, Params, Paths, BoxModel } from '../index'

const createPathFactory = (getPath: Path, parentPath: PathFactory): PathFactory => (params) => {
  const path = typeof getPath === 'string'
    ? getPath
    : getPath(params)

  if (path.indexOf('undefined') !== -1) {
    throw new Error(`Path is not valid: ${path}`)
  }

  if (parentPath) {
    return `${parentPath(params)}/${path}`
  }

  return `/${path}`
}

/**
 * Generate paths for client-side operations.
 */
export function generatePaths(
  name: string, // Name of the model
  param: string, // Name of the URL parameter to select when getting
  parent: BoxModel // Parent of the model
): Paths {
  const parentPath = parent && parent.paths && parent.paths.get

  const fetch = createPathFactory(`${name}s`, parentPath)
  const create = createPathFactory(`add-${name}`, parentPath)
  const get = createPathFactory(params => `${name}s/${params[param]}`, parentPath)
  const edit = createPathFactory('edit', get)
  const reorder = createPathFactory(`reorder/${name}s`, parentPath)

  return { fetch, create, get, edit, reorder }
}
