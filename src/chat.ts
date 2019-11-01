import { jid, xml } from '@xmpp/client'
import { IChat } from './interfaces/chat'
import { IConnection } from './interfaces/connection'
import { IOutgoing } from './interfaces/message'

export class Chat implements IChat {
    public readonly jid: jid.JID

    private readonly _connection: IConnection

    constructor(connection: IConnection, userJid: jid.JID) {
        this.jid = userJid
        this._connection = connection
    }

    public async send(message: string | IOutgoing): Promise<string> {
        let text: string
        let id: string | undefined
        if (typeof message === 'string') {
            text = message
        } else {
            ({ id, text } = message)
        }

        if (id === undefined) {
            id = this._connection.createId()
        }

        const stanza = xml(
            'message',
            {
                id,
                type: 'chat',
                to: this.jid.toString(),
            },
            xml('body', text),
        )

        await this._connection.client.send(stanza)

        return id
    }
}
