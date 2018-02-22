/**
 * Converts a name to capital case.
 * Ex. "studentAccount" will be converted to "STUDENT_ACCOUNT"
 *
 * @param name The name to convert to capital case.
 */
export const toCapitalCase = (name: string) => {
  return name
    .split('')
    .map(
      character =>
        character == character.toUpperCase() &&
        character != character.toLowerCase()
          ? '_' + character
          : character.toUpperCase()
    )
    .join('')
}
