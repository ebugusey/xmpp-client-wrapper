import { client as xmppClient, jid, XmppOptions } from '@xmpp/client'
import { Client as XmppClient } from '@xmpp/client-core'
import { JID } from '@xmpp/jid'
import { Element } from '@xmpp/xml'
import { EventEmitter, once } from 'events'
import { Chat } from './chat'
import { IChat } from './interfaces/chat'
import { ClientStatus, IClient } from './interfaces/client'
import { IIncoming } from './interfaces/message'
import { IJoinOptions, IRoom } from './interfaces/muc'

export class Client extends EventEmitter implements IClient {
    private readonly _client: XmppClient
    private readonly _emitter: IClient

    constructor(xmpp: XmppClient) {
        super()

        this._emitter = this

        this._client = xmpp
            .on('stanza', this.onStanza)
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

    public async chatWith(userJid: JID): Promise<IChat> {
        this.throwIfOffline()
        await this.waitForOnline()

        const chat = new Chat(userJid, this._client)

        return chat
    }

    public join(channelJid: JID, opts?: IJoinOptions): Promise<IRoom> {
        throw new Error('Method not implemented.')
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

    private onStanza(stanza: Element): void {
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

    private async onChat(stanza: Element): Promise<void> {
        const body = stanza.getChild('body')
        if (!body) {
            return
        }

        const from = jid(stanza.attrs.from)

        const message: IIncoming = {
            id: stanza.attrs.id,
            text: body.getText(),
            from: from.toString(),
        }

        const chat = await this.chatWith(from)

        this._emitter.emit('chat', chat, message)
    }
}

export function client(opts: XmppOptions): IClient {
    const xmpp = xmppClient(opts)

    const result = new Client(xmpp)

    return result
}
