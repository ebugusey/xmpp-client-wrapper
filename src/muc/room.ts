import { jid, xml } from '@xmpp/client'
import { EventEmitter } from 'events'
import { StanzaError } from '../errors/stanza-error'
import { IConnection } from '../interfaces/connection'
import { IOutgoing } from '../interfaces/message'
import { IJoinOptions, IOccupant, IRoom } from '../interfaces/muc'
import { bareSenderIs, isError, isNormal, isPresence } from '../stanza/filter'
import { getStanza } from '../stanza/helper'
import { isSelfPresence } from './filter'

const JOIN_TIMEOUT_IN_MS = 60000

const NS_MUC = 'http://jabber.org/protocol/muc'

export class Room extends EventEmitter implements IRoom {
    public readonly roomJid: jid.JID

    private readonly _connection: IConnection
    private readonly _emitter: IRoom

    private _userJid?: jid.JID

    private _joined: boolean
    private _connecting: boolean

    constructor(connection: IConnection, roomJid: jid.JID) {
        super()

        this.roomJid = roomJid.bare()

        this._emitter = this
        this._connection = connection

        this._joined = false
        this._connecting = false
    }

    public get joined(): boolean { return this._joined }
    public get name(): string { return '' }
    public get subject(): string { return '' }
    public get occupants(): readonly IOccupant[] { return [] }

    public async join(opts: IJoinOptions): Promise<this> {
        if (this._joined) {
            throw new Error('Already joined.')
        }

        if (this._connecting) {
            throw new Error('Connection in progress.')
        }

        this._connecting = true

        let fullJid: jid.JID

        try {
            fullJid = createUserJid(this.roomJid, opts.nick)
            await enterRoom(this._connection, fullJid)
        } finally {
            this._connecting = false
        }

        this._joined = true
        this._userJid = fullJid

        return this
    }

    public leave(): Promise<this> {
        throw new Error('Method not implemented.')
    }
    public send(message: string | IOutgoing): Promise<string> {
        throw new Error('Method not implemented.')
    }
}

async function enterRoom(connection: IConnection, fullJid: jid.JID): Promise<void> {
    const presenceId = connection.createId()
    const joinPresence = xml(
        'presence',
        {
            id: presenceId,
            to: fullJid.toString(),
        },
        xml(
            'x', NS_MUC,
        ),
    )

    // If we don't prepare promise before sending presence
    // we can miss response.
    const responsePromise = getStanza(
        connection.client,
        stanza =>
            isPresence(stanza)
            && bareSenderIs(stanza, fullJid.bare())
            && (
                isNormal(stanza) && isSelfPresence(stanza)
                || isError(stanza, presenceId)
            ),
        JOIN_TIMEOUT_IN_MS,
    )

    await connection.client.send(joinPresence)

    const response = await responsePromise

    StanzaError.throwIfError(response)
}

function createUserJid(room: jid.JID, nick: string): jid.JID {
    const userJid = jid(room.local, room.domain, nick)

    return userJid
}
