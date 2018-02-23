/**
 * Converts camelCase to CAPITAL_CASE.
 *
 * @param name The name to convert
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
 *
 * @param name The name to convert
 */
export const toPascalCase = (name: string) => {
  return name.slice(0, 1).toUpperCase + name.slice(1)
}
