import { jid, xml } from '@xmpp/client'

export function isPresence(stanza: xml.Element): boolean {
    return stanza.is('presence')
}

export function isNormal(stanza: xml.Element): boolean {
    return stanza.attrs.type === undefined
}

export function isError(stanza: xml.Element): boolean
export function isError(stanza: xml.Element, id: string): boolean

export function isError(stanza: xml.Element, id?: string): boolean {
    let result = stanza.attrs.type === 'error'
    if (id !== undefined) {
        result = result && stanzaIdIs(stanza, id)
    }

    return result
}

export function stanzaIdIs(stanza: xml.Element, value: string) {
    return stanza.attrs.id === value
}

export function bareSenderIs(stanza: xml.Element, value: jid.JID): boolean {
    const senderJid = jid(stanza.attrs.from)

    return senderJid.bare().equals(value)
}
