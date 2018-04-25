export const toTypeName = (modelName: string) => modelName.substring(0, 1).toUpperCase() + modelName.substring(1)

export const toModelName = (typeName: string) => typeName.substring(0, 1).toLowerCase() + typeName.substring(1)
