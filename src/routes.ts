import * as React from 'react'

import { RouteProps } from 'react-router'
import { Routes } from '../index'

type RouteGenerator = (name: string, pluralName: string) => Routes

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
