import { xml } from '@xmpp/client'
import { MucUser, StatusCode } from './muc-user'

export function isSelfPresence(stanza: xml.Element) {
    return haveStatus(stanza, StatusCode.selfPresence)
}

export function haveStatus(stanza: xml.Element, status: StatusCode) {
    const extension = MucUser.fromStanza(stanza)
    if (extension === undefined) {
        return false
    }

    return extension.haveStatus(status)
}
