import { JID } from '@xmpp/jid'
import { IChat } from './chat'
import { IIncoming } from './message'
import { IJoinOptions, IRoom } from './muc'

export enum ClientStatus {
    online,
    offline,
    connecting,
}

export interface IClient extends NodeJS.EventEmitter {
    readonly status: ClientStatus

    readonly joinedRooms: ReadonlyArray<IRoom>

    on(event: 'chat', listener: (chat: IChat, message: IIncoming) => void): this
    on(event: 'error', listener: (err: Error) => void): this

    emit(event: 'chat', chat: IChat, message: IIncoming): boolean
    emit(event: 'error', err: Error): boolean

    start(): Promise<void>
    stop(): Promise<void>

    chatWith(jid: JID): Promise<IChat>
    join(channel: JID, opts?: IJoinOptions): Promise<IRoom>
}
