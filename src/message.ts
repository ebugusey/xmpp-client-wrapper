export interface IMessage {
    id?: string
    text: string
}

export interface IIncoming extends IMessage {
    from: string
    timestamp?: Date
}

// tslint:disable-next-line: no-empty-interface
export interface IOutgoing extends IMessage {
}
