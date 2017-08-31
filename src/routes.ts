import { ModelComponents, Box, Route } from '../index'

export function generateRoutes(modelName: string, components: ModelComponents, box: Box<any>) {
  const { Create, Reorder, Edit, Detail, Table } = components
  const routes: Route[] = []

  if (Create) {
    routes.push({
      path: `/:parentModel/:parentId/add-${modelName}`,
      component: Create,
    })
  }

  if (Reorder) {
    routes.push({
      path: `/:parentModel/:parentId/reorder-${modelName}`,
      component: Reorder,
    })
  }

  if (Edit) {
    routes.push({
      path: `/${modelName}/:id/edit`,
      component: Edit,
    })
  }

  if (Detail) {
    routes.push({
      path: `/${modelName}/:id`,
      component: Detail,
    })
  }

  if (Create) {
    routes.push({
      path: `/add-${modelName}`,
      component: Create,
    })
  }

  if (Table) {
    routes.push({
      path: `/${modelName}`,
      component: Table,
    })
  }

  return routes
}
