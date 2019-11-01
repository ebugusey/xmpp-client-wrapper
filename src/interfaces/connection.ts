import { xml } from '@xmpp/client'

export interface IStanzaEmitter {
    on(event: 'stanza', listener: (stanza: xml.Element) => void): this
    off(event: 'stanza', listener: (stanza: xml.Element) => void): this
}

export interface IStanzaSender {
    send(stanza: xml.Element): Promise<void>
}

export type XmppClient = IStanzaEmitter & IStanzaSender

export type IdGenerator = () => string

export interface IConnection {
    client: XmppClient
    createId: IdGenerator
}
