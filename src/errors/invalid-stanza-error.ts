import { xml } from '@xmpp/client'
import { XMPPError } from './xmpp-error'

export class InvalidStanzaError extends XMPPError {
    public readonly stanza: xml.Element

    constructor(message: string, stanza: xml.Element) {
        super(message)
        this.name = 'InvalidStanzaError'

        this.stanza = stanza
    }
}
