import { config } from '../../config'

const types = {
  get SCHEMA_REQUEST() { return `${config.namespace}/SCHEMA` },
  get SCHEMA_OK() { return `${config.namespace}/SCHEMA_OK` },
  get SCHEMA_FAIL() { return `${config.namespace}/SCHEMA_FAIL` }
}

export default types
