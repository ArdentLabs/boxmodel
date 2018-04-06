import { config } from './config'

export const query = (gqlQuery: string, variables?: any): Promise<{ data: any }> =>
  fetch(config.apiUrl + '/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      query: gqlQuery,
      variables
    })
  })
    .then((response) => response.json())
