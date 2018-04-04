
/** The query used to prepare for introspection. This query is only used once. */
export const INIT = `
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
`.trim().replace(/\s+/g, ' ')

/** The query used to figure out the fields of a type. This query is used multiple times, once for each type. */
export const TYPE = `
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
`.trim().replace(/\s+/g, ' ')
