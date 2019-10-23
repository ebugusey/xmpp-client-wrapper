import { xml } from '@xmpp/client'
import { Client as XmppClient } from '@xmpp/client-core'
import { IConnection, IStanzaEmitter } from '../interfaces/connection'

const DEFAULT_TIMEOUT_IN_MS = 10000

type StanzaFilter = (stanza: xml.Element) => boolean

export function getStanza(emitter: IStanzaEmitter, filter: StanzaFilter, timeoutInMs?: number): Promise<xml.Element> {
    const promise = new Promise<xml.Element>((resolve, reject) => {
        if (timeoutInMs === undefined) {
            timeoutInMs = DEFAULT_TIMEOUT_IN_MS
        }

        const eventName = 'stanza'

        const listener = (stanza: xml.Element) => {
            if (!filter(stanza)) {
                return
            }

            clearTimeout(timeoutRef)
            emitter.off(eventName, listener)
            resolve(stanza)
        }

        const timeoutRef = setTimeout(() => {
            emitter.off(eventName, listener)
            reject(new Error(`Timed out after ${timeoutInMs} milliseconds.`))
        }, timeoutInMs)

        emitter.on(eventName, listener)
    })

    return promise
}
