import { xml } from '@xmpp/client'
import * as assert from 'assert'
import { isError } from '../stanza/filter'
import { invertMap, tryParseEnum } from '../utils'
import { InvalidStanzaError } from './invalid-stanza-error'
import { XMPPError } from './xmpp-error'

const ERROR = 'error'

const TEXT = 'text'
const NAMESPACE = 'urn:ietf:params:xml:ns:xmpp-stanzas'

export enum ErrorType {
    auth,
    cancel,
    continue,
    modify,
    wait,
}

export enum ErrorCondition {
    badRequest,
    conflict,
    featureNotImplemented,
    forbidden,
    gone,
    internalServerError,
    itemNotFound,
    jidMalformed,
    notAcceptable,
    notAllowed,
    notAuthorized,
    policyViolation,
    recipientUnavailable,
    redirect,
    registrationRequired,
    remoteServerNotFound,
    remoteServerTimeout,
    resourceConstraint,
    serviceUnavailable,
    subscriptionRequired,
    undefinedCondition,
    unexpectedRequest,
}

export class StanzaError extends XMPPError {
    public static fromStanza(stanza: xml.Element): StanzaError {
        assert.ok(isError(stanza), 'Stanza is not an error.')

        return parse(stanza)
    }

    public static throwIfError(stanza: xml.Element): void {
        if (!isError(stanza)) {
            return
        }

        const error = parse(stanza)
        throw error
    }

    public readonly type: ErrorType
    public readonly condition: ErrorCondition
    public readonly text: readonly string[]

    public readonly stanza: xml.Element

    constructor(type: ErrorType, condition: ErrorCondition, texts: string[], stanza: xml.Element) {
        const message =
            'XMPPError: ' +
            `${getConditionDescription(condition)} - ${getTypeDescription(type)}` +
            ` [${texts.join(', ')}]`

        super(message)

        this.name = 'StanzaError'

        this.type = type
        this.condition = condition
        this.text = texts
        this.stanza = stanza
    }
}

function parse(stanza: xml.Element): StanzaError {
    const errorElement = stanza.getChild(ERROR)
    if (errorElement === undefined) {
        throw new InvalidStanzaError("No 'error' node found in stanza.", stanza)
    }

    const type = tryParseType(errorElement.attrs.type)
    if (type === undefined) {
        throw new InvalidStanzaError('Unknown error type', stanza)
    }

    const text: string[] = []
    let condition: ErrorCondition | undefined

    const children = errorElement.getChildElements()
        .filter(e => e.getNS() === NAMESPACE)

    for (const child of children) {
        const name = child.getName()
        switch (name) {
            case TEXT:
                text.push(child.getText())
                break

            default:
                condition = parseCondition(name)
                break
        }
    }

    if (condition === undefined) {
        throw new InvalidStanzaError('No condition in error stanza.', stanza)
    }

    const error = new StanzaError(type, condition, text, stanza)

    return error
}

function tryParseType(value: unknown): ErrorType | undefined {
    if (value === undefined) {
        return undefined
    }

    const type = tryParseEnum(ErrorType, value)
    if (type === undefined) {
        return undefined
    }

    return type
}

function getTypeDescription(type: ErrorType): string {
    return ErrorType[type]
}

const conditionMap = new Map<string, ErrorCondition>([
    ['bad-request', ErrorCondition.badRequest],
    ['conflict', ErrorCondition.conflict],
    ['feature-not-implemented', ErrorCondition.featureNotImplemented],
    ['forbidden', ErrorCondition.forbidden],
    ['gone', ErrorCondition.gone],
    ['internal-server-error', ErrorCondition.internalServerError],
    ['item-not-found', ErrorCondition.itemNotFound],
    ['jid-malformed', ErrorCondition.jidMalformed],
    ['not-acceptable', ErrorCondition.notAcceptable],
    ['not-allowed', ErrorCondition.notAllowed],
    ['not-authorized', ErrorCondition.notAuthorized],
    ['policy-violation', ErrorCondition.policyViolation],
    ['recipient-unavailable', ErrorCondition.recipientUnavailable],
    ['redirect', ErrorCondition.redirect],
    ['registration-required', ErrorCondition.registrationRequired],
    ['remote-server-not-found', ErrorCondition.remoteServerNotFound],
    ['remote-server-timeout', ErrorCondition.remoteServerTimeout],
    ['resource-constraint', ErrorCondition.resourceConstraint],
    ['service-unavailable', ErrorCondition.serviceUnavailable],
    ['subscription-required', ErrorCondition.subscriptionRequired],
    ['undefined-condition', ErrorCondition.undefinedCondition],
    ['unexpected-request', ErrorCondition.unexpectedRequest],
])

const reverseConditionMap = invertMap(conditionMap)

function parseCondition(value: string): ErrorCondition {
    const condition = conditionMap.get(value)
    if (condition === undefined) {
        return ErrorCondition.undefinedCondition
    }

    return condition
}

function getConditionDescription(condition: ErrorCondition): string {
    let description = reverseConditionMap.get(condition)
    if (description === undefined) {
        description = ''
    }

    return description
}
