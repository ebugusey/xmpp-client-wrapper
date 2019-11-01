import { client as xmppClient, jid, xml, XmppClient, XmppOptions } from '@xmpp/client'
import { EventEmitter, once } from 'events'
import { Chat } from './chat'
import { createId } from './id-generator'
import { IChat } from './interfaces/chat'
import { ClientStatus, IClient } from './interfaces/client'
import { IConnection } from './interfaces/connection'
import { IIncoming } from './interfaces/message'
import { IJoinOptions, IRoom } from './interfaces/muc'

export class Client extends EventEmitter implements IClient {
    private readonly _connection: IConnection
    private readonly _client: XmppClient
    private readonly _emitter: IClient

    constructor(xmpp: XmppClient) {
        super()

        this._emitter = this

        this._client = xmpp
            .on('stanza', this.onStanza)

        this._connection = {
            client: this._client,
            createId,
        }
    }

    public get status(): ClientStatus {
        let status = ClientStatus.offline
        switch (this._client.status) {
            case 'online':
                status = ClientStatus.online
                break

            case 'offline':
                status = ClientStatus.offline
                break

            default:
                status = ClientStatus.connecting
                break
        }

        return status
    }

    public get joinedRooms(): IRoom[] {
        return []
    }

    public async start(): Promise<void> {
        this.throwIfOnline()
        await this._client.start()
        await this.waitForOnline()
    }

    public async stop(): Promise<void> {
        this.throwIfOffline()
        await this._client.stop()
        await this.waitForOffline()
    }

    public async chatWith(userJid: jid.JID): Promise<IChat> {
        this.throwIfOffline()
        await this.waitForOnline()

        const chat = this.getChat(userJid)

        return chat
    }

    public join(channelJid: jid.JID, opts?: IJoinOptions): Promise<IRoom> {
        throw new Error('Method not implemented.')
    }

    private throwIfOnline() {
        if (this.status === ClientStatus.online) {
            throw new Error('Already online.')
        }
    }

    private throwIfOffline() {
        if (this.status === ClientStatus.offline) {
            throw new Error('Client is offline.')
        }
    }

    private async waitForOnline(): Promise<void> {
        if (this.status === ClientStatus.online) {
            return
        }

        await once(this._client, 'online')
    }

    private async waitForOffline(): Promise<void> {
        if (this.status === ClientStatus.offline) {
            return
        }

        await once(this._client, 'offline')
    }

    private onStanza(stanza: xml.Element): void {
        if (stanza.is('message')) {
            switch (stanza.attrs.type) {
                case 'chat':
                    this.onChat(stanza)
                    break

                default:
                    break
            }
        }
    }

    private onChat(stanza: xml.Element): void {
        const body = stanza.getChild('body')
        if (body === undefined) {
            return
        }

        const from = jid(stanza.attrs.from)

        const message: IIncoming = {
            id: stanza.attrs.id,
            text: body.getText(),
            from: from.toString(),
        }

        const chat = this.getChat(from)

        this._emitter.emit('chat', chat, message)
    }

    private getChat(userJid: jid.JID): IChat {
        return new Chat(this._connection, userJid)
    }
}

export function client(opts: XmppOptions): IClient {
    const xmpp = xmppClient(opts)

    const result = new Client(xmpp)

    return result
}
