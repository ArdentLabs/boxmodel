import { Options, Routes } from '../index'

export function generateRoutes(options: Options): Routes {
  const name = options.modelName
  const pluralName = options.pluralModelName
  return [
    {
      path:`/:parentModel/:parentId/add-${name}`,
    },
    {
      path:`/:parentModel/:parentId/reorder-${pluralName}`
    },
    {
      path:`/${pluralName}/:${name}Id/edit`,
    },
    {
      path:`/${pluralName}/:${name}Id`,
    },
    {
      path:`/${pluralName}`,
    },
    {
      path:`/add-${name}`,
    },
  ]
}
