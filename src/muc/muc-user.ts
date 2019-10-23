import { xml } from '@xmpp/client'
import { isNotUndefined } from '../utils'

const ELEMENT = 'x'
const NAMESPACE = 'http://jabber.org/protocol/muc#user'

export enum StatusCode {
    selfPresence,
}

export class MucUser {
    public static fromStanza(stanza: xml.Element): MucUser | undefined {
        return tryParse(stanza)
    }

    public readonly status: readonly StatusCode[]

    constructor(status: StatusCode[]) {
        this.status = status
    }

    public haveStatus(status: StatusCode): boolean {
        return this.status.find(s => s === status) !== undefined
    }
}

function tryParse(stanza: xml.Element): MucUser | undefined {
    const element = stanza.getChild(ELEMENT, NAMESPACE)
    if (element === undefined) {
        return undefined
    }

    const status = element.getChildren('status')
        .map(s => statusCodes.get(s.attrs.code))
        .filter<StatusCode>(isNotUndefined)

    const extension = new MucUser(status)

    return extension
}

const statusCodes = new Map<string, StatusCode>([
    ['110', StatusCode.selfPresence],
])
