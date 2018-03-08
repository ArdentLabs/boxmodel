describe('boxmodel', () => {
  const query = (gql: string, variables?: object) =>
    fetch('https://ardent-api-next.ardentlabs.io/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: gql,
        variables,
      }),
    }).then(response => response.json())

  it('should initialize', () => {

  })
})
