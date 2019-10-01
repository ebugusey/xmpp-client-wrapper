import { JID } from '@xmpp/jid'
import { IIncoming, IOutgoing } from './message'

export interface IJoinOptions {
    nick?: string
    history?: {
        seconds?: number,
        maxStanza?: number,
        since?: Date,
    }
}

export interface IRoom extends NodeJS.EventEmitter {
    jid: JID
    name: string
    subject: string
    occupants: ReadonlyArray<IOccupant>

    on(event: 'message', listener: (message: IIncoming) => void): this
    on(event: 'subject', listener: (subject: string) => void): this

    join(opts: IJoinOptions): Promise<this>
    leave(): Promise<this>

    send(message: IOutgoing | string): Promise<string>
}

interface IOccupant {
    realJid?: JID
    roomJid: JID
    nick: string
    affiliation: Affiliation
    role: Role
}

enum Affiliation {
    none,
    owner,
    admin,
    member,
    outcast,
}

enum Role {
    none,
    moderator,
    participant,
    visitor,
}
