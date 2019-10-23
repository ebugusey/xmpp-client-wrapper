declare module '@xmpp/client' {
    import { Client } from '@xmpp/client-core'
    import { Reconnect } from '@xmpp/reconnect'
    import jid from '@xmpp/jid'
    import xml from '@xmpp/xml'

    export interface XmppOptions {
        /**
         * The service to connect to, accepts an URI or a domain.
         *  - `domain` lookup and connect to the most secure endpoint using @xmpp/resolve
         *  - `xmpp://hostname:port` plain TCP, may be upgraded to TLS by @xmpp/starttls
         *  - `xmpps://hostname:port` direct TLS
         *  - `ws://hostname:port/path` plain WebSocket
         *  - `wss://hostname:port/path` secure WebSocket
         */
        service: string
        /**
         * Optional domain of the service, if omitted will use the hostname from {@link XmppOptions#service}.
         * Useful when the service domain is different than the service hostname.
         */
        domain?: string
        /**
         * Optional resource for resource binding.
         */
        resource?: string
        /**
         * Optional username for sasl.
         */
        username?: string
        /**
         * Optional password for sasl.
         */
        password?: string
    }

    interface Xmpp {
        /**
         * @see {@link https://github.com/xmppjs/xmpp.js/blob/HEAD/packages/reconnect}
         */
        reconnect: Reconnect
    }

    type xmpp = Client & Xmpp

    /**
     * Creates instance of xmpp client.
     * @param options Connection options.
     */
    export function client(options: XmppOptions): xmpp

    export { jid, xml }
}
