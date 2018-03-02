// Some common typings used throughout the module goes here.s

export interface GraphQLResponseData<DataType = any> {
  data: {
    [queryName: string]: DataType
  }
  errors?: Array<{
    message: string
    locations: Array<{
      line: number
      column: number
    }>
  }>
}
/**
 * An async function called with a graphql query to fetch data from server.
 * Should look like (query, variables) => fetch(graphqlUrl, { body: JSON.stringify({ query, variables }) }).then(response => response.json())
 */
export type GQLQuerier = (query: string, variables?: any) => Promise<GraphQLResponseData>

export type FieldValue = number | string

// Terminus of a nested filter
export interface FieldFilter {
  $eq?: FieldValue
  $gt?: FieldValue
  $gte?: FieldValue
  $lt?: FieldValue
  $lte?: FieldValue
  $gtDate?: Date
  $gteDate?: Date
  $ltDate?: Date
  $lteDate?: Date
}

/** Corresponds to the `Filters` GraphQL type. */
export interface Filters {
  [fieldName: string]: FieldValue | FieldFilter | Filters
}

/** Corresponds to the `Sorts` GraphQL type. */
export interface Sorts {
  [fieldName: string]: number | Sorts
}

/** Corresponds to the `Pagination` GraphQL type. */
export interface Pagination {
  skip?: number
  limit?: number
  after?: string
}

/** Used to designate how other models should be joined. */
export interface Join {
  /**
   * The `field` should be a field in the graphql type itself.
   *
   * `true` indicates a simple join.
   * `string` indicates an aliased simple join.
   * `Join` indicates a recursive join.
   */
  [field: string]: true | string | Join
}

export type Query = {
  filter?: Filters
  sort?: Sorts
  page?: Pagination
  join?: Join
} | {
  id: string
}


