/** The query used to prepare for introspection. This query is only used once. */
import { q } from '../../utils'

export const INIT = q`
  fragment typeFields on __Type {
    fields {
      name
      type {
        name
        kind
        ofType {
          name
        }
      }
    }
  }

  query IntrospectionInit {
    queries: __type(name: "Query") {
      ...typeFields
    }
    mutations: __type(name: "Mutation") {
      ...typeFields
    }
  }
`

/** The query used to figure out the fields of a type. This query is used multiple times, once for each type. */
export const TYPE = q`
  query IntrospectionType($typeName: String!) {
    __type(name: $typeName) {
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  }
`
