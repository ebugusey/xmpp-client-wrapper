declare module '@xmpp/reconnect' {
    import { EventEmitter } from 'events'

    export class Reconnect extends EventEmitter {
        /**
         * Property to set/get the delay in milliseconds between connection
         * closed and reconnecting.
         *
         * Default is `1000`.
         */
        delay: number

        /**
         * Emitted each time a re-connection is attempted.
         * @param event Event name.
         * @param listener Event listener.
         */
        on(event: 'reconnecting', listener: () => void): this
        /**
         * Emitted each time a re-connection succeed.
         * @param event Event name.
         * @param listener Event listener.
         */
        on(event: 'reconnected', listener: () => void): this
        /**
         * Emitted on entity each time a re-connection fails.
         * @param event Event name.
         * @param listener Event listener.
         */
        on(event: 'error', listener: (err: Error) => void): this
    }
}
