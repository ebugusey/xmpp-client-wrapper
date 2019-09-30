import { JID } from '@xmpp/jid'
import { IIncoming, IOutgoing } from './message'
import { IJoinOptions, IRoom } from './muc'

export enum ClientStatus {
    online,
    offline,
}

export interface IClient extends NodeJS.EventEmitter {
    status: ClientStatus

    joinedRooms: ReadonlyArray<IRoom>

    on(event: 'chat', listener: (chat: IChat, message: IIncoming) => void): this

    chatWith(jid: JID): Promise<IChat>
    join(channel: JID, opts?: IJoinOptions): Promise<IRoom>
}

interface IChat extends NodeJS.EventEmitter {
    jid: JID

    send(message: IOutgoing | string): Promise<string>
}
