declare module '@xmpp/client-core' {
    import { Connection } from '@xmpp/connection'

    export class Client extends Connection {
        /**
         * Sends a stanza.
         * @param stanza Stanza (xml element) to send.
         * @returns Promise that resolves once the stanza is serialized
         * and written to the socket or rejects if any of those fails.
         */
        send(stanza: Element): Promise<void>
    }
}
