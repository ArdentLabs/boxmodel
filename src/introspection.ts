export default `
  fragment typeData on __Type {
    fields {
      name
      type {
        name
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
              }
            }
          }
        }
      }
      args {
        name
      }
    }
  }

  query Introspection {
    queries: __type(name: "Query") {
      ...typeData
    }
  }
`.replace(/\s+/g, ' ').trim()
