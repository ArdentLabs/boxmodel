import { Options, RouteFactory, RouteOptions } from '../index'

export function generateRoutes(options: Options): RouteFactory {
  const { modelName } = options
  return ({ Table, Create, Reorder, Edit, Detail }: RouteOptions) => [
    {
      path:`/:parentModel/:parentId/add-${modelName}`,
      component: Create,
    },
    {
      path:`/:parentModel/:parentId/reorder-${modelName}`,
      component: Reorder,
    },
    {
      path:`/${modelName}/:id/edit`,
      component: Edit,
    },
    {
      path:`/${modelName}/:id`,
      component: Detail,
    },
    {
      path:`/${modelName}`,
      component: Table,
    },
    {
      path:`/add-${modelName}`,
      component: Create,
    },
  ]
}
