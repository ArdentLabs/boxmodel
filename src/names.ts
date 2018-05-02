export const pascalCase = (modelName: string) => modelName.substring(0, 1).toUpperCase() + modelName.substring(1)

export const camelCase = (typeName: string) => typeName.substring(0, 1).toLowerCase() + typeName.substring(1)

export const capitalize = (modelName: string) => modelName
  .split('')
  .map((char) => char === char.toUpperCase() && char !== char.toLowerCase() ? '_' + char : char.toUpperCase())
