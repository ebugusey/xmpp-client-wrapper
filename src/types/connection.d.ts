declare module '@xmpp/connection' {
    import { EventEmitter } from 'events'
    import { JID } from '@xmpp/jid'
    import { Element } from '@xmpp/xml'

    export type ConnectionStatus =
        'online'
        | 'offline'
        | 'connecting'
        | 'opening'
        | 'open'
        | 'closing'
        | 'close'
        | 'disconnecting'
        | 'disconnect'

    export class Connection extends EventEmitter {
        /**
         * `online` indicates that `xmpp` is authenticated and addressable.
         * It is emitted every time there is a successful (re)connection.
         *
         * `offline` indicates that `xmpp` disconnected and no automatic attempt
         * to reconnect will happen (after calling `xmpp.stop()`).
         *
         * Additional status:
         *  - `connecting`: Socket is connecting
         *  - `connect`: Socket is connected
         *  - `opening`: Stream is opening
         *  - `open`: Stream is open
         *  - `closing`: Stream is closing
         *  - `close`: Stream is closed
         *  - `disconnecting`: Socket is disconnecting
         *  - `disconnect`: Socket is disconnected
         *
         * You can listen for status change using the `status` event.
         */
        status: ConnectionStatus

        /**
         * Emitted when the status changes.
         * @param event Event name.
         * @param listener Event listener.
         */
        on(event: 'status', listener: (status: ConnectionStatus) => void): this
        /**
         * Emitted when an error occurs.
         * For connection errors, xmpp will reconnect on its own using `@xmpp/reconnect`
         * however a listener MUST be attached to avoid uncaught exceptions.
         * @param event Event name.
         * @param listener Event listener.
         */
        on(event: 'error', listener: (error: Error) => void): this
        /**
         * Emitted when a stanza is received and parsed.
         * @param event Event name.
         * @param listener Event listener.
         */
        on(event: 'stanza', listener: (stanza: Element) => void): this
        /**
         * Emitted when connected, authenticated and ready to receive/send stanzas.
         * @param event Event name.
         * @param listener Event listener.
         */
        on(event: 'online', listener: (jid: JID) => void): void
        /**
         * Emitted when the connection is closed an no further attempt to reconnect
         * will happen, after calling `xmpp.stop()`.
         * @param event Event name.
         * @param listener Event listener.
         */
        on(event: 'offline', listener: () => void): void

        /**
         * Starts the connection. Attempts to reconnect will automatically happen
         * if it cannot connect or gets disconnected.
         * @returns Promise that resolves if the first attempt succeed
         * or rejects if the first attempt fails.
         */
        start(): Promise<void>
        /**
         * Stops the connection and prevent any further auto reconnect/retry.
         * @returns Promise that resolves once the stream closes
         * and the socket disconnects.
         */
        stop(): Promise<void>
    }
}
