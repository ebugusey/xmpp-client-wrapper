import { xml } from '@xmpp/client'

export function isError(stanza: xml.Element): boolean {
    return stanza.attrs.type === 'error'
}
