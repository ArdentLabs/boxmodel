// Some common typings used throughout the module goes here.s

export interface GraphQLResponseData<DataType=any> {
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
