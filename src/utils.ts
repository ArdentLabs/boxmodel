import { }

/**
 * Since the parent could be any of the three relational types:
 *  - One to One
 *  - One to Many
 *  - Many to Many
 *
 * We need a way to reliably choose which parent gets choosen for operations.
 * This function does exactly that.
 *
 * If the relationship is One-to-Many or Many-to-Many, a closure is returned
 * since we need more information. Specifically, we need the URL parameters.
 *
 * If the relationship is One-to-One, there is only one parent, so the parent
 * state data is simply returned.
 */

export function parseParent(parent: BoxModel) {
  if (!parent) return parent

  //
  // One-to-Many OR Many-to-Many
  //

  if (Array.isArray(parent)) {
    // Type checking
    for (const p of parent) {
      if (typeof p !== 'object' || !p.$$isStateMetadata) {
        const error = `Expected 'parent' to be an array of metadata objects. Whereas, one element of 'parent' is of type '${typeof p}'.`
        throw new TypeError(error)
      }
    }

    return function getParentFromParams(params) {
      for (const p of parent) {
        if (p.modelId in params) {
          return p
        }
      }
      throw new Error('Parent not found in URL parameters. This probably means that one of the models is missing a parent. Specifically these:', parent)
    }
  }

  //
  // One-to-One
  //

  // Type checking
  if (typeof parent !== 'object' || !parent.$$isStateMetadata) {
    const error = `Expected 'parent' to a metadata object or an array of metadata objects. Whereas, 'parent' is of type '${typeof parent}'.`
    throw new TypeError(error)
  }

  return () => parent
}
