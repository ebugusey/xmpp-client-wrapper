import uuid from 'uuid/v1'
import { IdGenerator } from './interfaces/connection'

const createId: IdGenerator = () => uuid()

export { createId }
