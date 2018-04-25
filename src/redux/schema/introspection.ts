import { q } from '../../utils'

export default q`
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
