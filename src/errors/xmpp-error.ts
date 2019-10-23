
export class XMPPError extends Error {
    constructor(message?: string) {
        super(message)
        this.name = 'XMPPError'
    }
}
