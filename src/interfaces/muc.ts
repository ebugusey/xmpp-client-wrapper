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
    readonly roomJid: JID

    readonly joined: boolean

    readonly name: string
    readonly subject: string
    readonly occupants: readonly IOccupant[]

    on(event: 'message', listener: (message: IIncoming) => void): this
    on(event: 'subject', listener: (subject: string) => void): this
    on(event: 'error', listener: (err: Error) => void): this

    emit(event: 'message', message: IIncoming): boolean
    emit(event: 'subject', subject: string): boolean
    emit(event: 'error', err: Error): boolean

    join(opts: IJoinOptions): Promise<this>
    leave(): Promise<this>

    send(message: IOutgoing | string): Promise<string>
}

export interface IOccupant {
    realJid?: JID
    roomJid: JID
    nick: string
    affiliation: Affiliation
    role: Role
}

export enum Affiliation {
    none,
    owner,
    admin,
    member,
    outcast,
}

export enum Role {
    none,
    moderator,
    participant,
    visitor,
}
