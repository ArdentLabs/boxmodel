import * as React from 'react'

import { RouteProps } from 'react-router'

type RouteGenerator = (name: string, pluralName: string) => Array<Partial<RouteProps>>

export const generateRoutes: RouteGenerator = (name, pluralName) => {
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
