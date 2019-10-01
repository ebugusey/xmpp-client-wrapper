import { JID } from '@xmpp/jid'
import { IOutgoing } from './message'

export interface IChat {
    jid: JID

    send(message: IOutgoing | string): Promise<string>
}
