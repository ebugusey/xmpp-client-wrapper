import { jid } from '@xmpp/client'
import { IOutgoing } from './message'

export interface IChat {
    readonly jid: jid.JID

    send(message: IOutgoing | string): Promise<string>
}
