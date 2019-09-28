import { JID } from '@xmpp/jid'
import { IIncoming, IOutgoing } from './message'

export enum ClientStatus {
    online,
    offline,
}

export interface IClient extends NodeJS.EventEmitter {
    status: ClientStatus

    on(event: 'chat', listener: (chat: IChat, message: IIncoming) => void): this

    chatWith(jid: JID): Promise<IChat>
}

interface IChat extends NodeJS.EventEmitter {
    jid: JID

    send(message: IOutgoing | string): Promise<string>
}
