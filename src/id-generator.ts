import id from '@xmpp/id'
import { IdGenerator } from './interfaces/connection'

const createId: IdGenerator = () => id()

export { createId }
