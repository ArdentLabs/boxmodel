export type PathGenerator = (id: string) => string

export interface Paths {
  create: PathGenerator  // Path to create a new model.
  edit: PathGenerator    // Path to edit an existing model.
  fetch: PathGenerator   // Path to view a list of existing models.
  get: PathGenerator     // Path to view an existing model.
  reorder: PathGenerator // Path to reorder existing models
}

function createPathFactory(getPath: PathGenerator, absolute?: boolean) {
  return (id: string) => {
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
}

/**
 * Generate paths for client-side operations.
 */
export function generatePaths(modelName: string): Paths {
  const create = createPathFactory(() => `add-${modelName}`)
  const edit = createPathFactory((id: string) => `${modelName}/${id}/edit`, true)
  const fetch = createPathFactory(() => `${modelName}`, true)
  const get = createPathFactory((id: string) => `${modelName}/${id}`, true)
  const reorder = createPathFactory(() => `reorder-${modelName}`)

  return {
    create,
    edit,
    fetch,
    get,
    reorder
  }
}
