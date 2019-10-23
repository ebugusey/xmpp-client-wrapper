import { xml } from '@xmpp/client'
import { JID } from '@xmpp/jid'
import { IChat } from './interfaces/chat'
import { IConnection } from './interfaces/connection'
import { IOutgoing } from './interfaces/message'

export class Chat implements IChat {
    public readonly jid: JID

    private readonly _connection: IConnection

    constructor(jid: JID, connection: IConnection) {
        this.jid = jid
        this._connection = connection
    }

    public async send(message: string | IOutgoing): Promise<string> {
        if (typeof message === 'string') {
            message = this.createMessage(message)
        }

        if (message.id === undefined) {
            message.id = this._connection.createId()
        }

        const stanza = xml(
            'message',
            {
                type: 'chat',
                to: this.jid.bare.toString(),
            },
            xml('body', message.text),
        )

        await this._connection.client.send(stanza)

        return message.id
    }

    private createMessage(text: string): IOutgoing {
        const message: IOutgoing = {
            id: this._connection.createId(),
            text,
        }

        return message
    }
}
