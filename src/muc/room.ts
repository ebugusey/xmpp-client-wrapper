import { jid } from '@xmpp/client'
import { Client as XmppClient } from '@xmpp/client-core'
import { EventEmitter } from 'events'
import { IOutgoing } from '../interfaces/message'
import { IJoinOptions, IOccupant, IRoom } from '../interfaces/muc'

export class Room extends EventEmitter implements IRoom {
    public readonly roomJid: jid.JID

    private readonly _client: XmppClient
    private readonly _emitter: IRoom

    private _userJid?: jid.JID

    private _joined: boolean

    constructor(client: XmppClient, roomJid: jid.JID) {
        super()

        this.roomJid = roomJid.bare()

        this._emitter = this
        this._client = client

        this._joined = false
    }

    public get joined(): boolean { return this._joined }
    public get name(): string { return '' }
    public get subject(): string { return '' }
    public get occupants(): readonly IOccupant[] { return [] }

    public join(opts: IJoinOptions): Promise<this> {
        throw new Error('Method not implemented.')
    }

    public leave(): Promise<this> {
        throw new Error('Method not implemented.')
    }
    public send(message: string | IOutgoing): Promise<string> {
        throw new Error('Method not implemented.')
    }
}
