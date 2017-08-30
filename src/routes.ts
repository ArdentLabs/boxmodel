import { Options, Routes } from '../index'

export function generateRoutes(options: Options): Routes {
  const { modelName } = options
  return [
    {
      path:`/:parentModel/:parentId/add-${modelName}`,
    },
    {
      path:`/:parentModel/:parentId/reorder-${modelName}`
    },
    {
      path:`/${modelName}/:id/edit`,
    },
    {
      path:`/${modelName}/:id`,
    },
    {
      path:`/${modelName}`,
    },
    {
      path:`/add-${modelName}`,
    },
  ]
}
