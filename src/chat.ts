import { xml } from '@xmpp/client'
import { Client as XmppClient } from '@xmpp/client-core'
import { JID } from '@xmpp/jid'
import uuid = require('uuid/v1')
import { IChat } from './interfaces/chat'
import { IOutgoing } from './interfaces/message'

export class Chat implements IChat {
    public readonly jid: JID

    private readonly _client: XmppClient

    constructor(jid: JID, client: XmppClient) {
        this.jid = jid
        this._client = client
    }

    public async send(message: string | IOutgoing): Promise<string> {
        if (typeof message === 'string') {
            message = createMessage(message)
        }

        if (message.id === undefined) {
            message.id = createId()
        }

        const stanza = xml(
            'message',
            {
                type: 'chat',
                to: this.jid.bare.toString(),
            },
            xml('body', message.text),
        )

        await this._client.send(stanza)

        return message.id
    }
}

function createMessage(text: string): IOutgoing {
    const message: IOutgoing = {
        id: createId(),
        text,
    }

    return message
}

function createId(): string {
    return uuid()
}
