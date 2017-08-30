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
      path:`/${pluralName}/:id/edit`,
    },
    {
      path:`/${pluralName}/:id`,
    },
    {
      path:`/${pluralName}`,
    },
    {
      path:`/add-${name}`,
    },
  ]
}
