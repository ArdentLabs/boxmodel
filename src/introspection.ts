export default `
  query Introspection {
    __type(name: "Query") {
      fields {
        name
        type {
          name
        }
      }
    }
    __schema {
      types {
        name
        inputFields {
          name
        }
      }
    }
  }
`.replace(/\s+/g, ' ').trim()
