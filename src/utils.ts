import { Store } from 'redux'

/**
 * Converts camelCase to CAPITAL_CASE.
 */
export const toCapitalCase = (name: string) => {
  return name
    .split('')
    .map(
      character =>
        character === character.toUpperCase() &&
        character !== character.toLowerCase()
          ? '_' + character
          : character.toUpperCase()
    )
    .join('')
}

/**
 * Converts camelCase to PascalCase
 */
export const toPascalCase = (name: string) => {
  return name.slice(0, 1).toUpperCase + name.slice(1)
}

/**
 * Makes a `Promise` that resolves when the store is considered ready.
 *
 * @param store The redux store to monitor
 * @param ready A function that determines whether the store is ready given its state
 */
export const waitUntil = <S>(
  store: Store<S>,
  ready: (store: S) => boolean
): Promise<void> => {
  if (ready(store.getState())) {
    return new Promise(resolve => resolve())
  } else {
    return new Promise(resolve => {
      const unsubscribe = store.subscribe(() => {
        if (ready(store.getState())) {
          unsubscribe()
          resolve()
        }
      })
    })
  }
}
