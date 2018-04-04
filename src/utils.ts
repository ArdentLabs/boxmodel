import { config } from './config'

export const query = (query: string, variables?: any): Promise<{ data: any }> =>
  config.fetch(config.apiUrl + '/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      query,
      variables
    })
  })
    .then(response => response.json())
