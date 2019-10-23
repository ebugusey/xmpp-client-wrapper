
export function isNotUndefined<T>(value: T | undefined): value is T {
    return value !== undefined
}

export function invertMap<TKey, TValue>(map: Map<TKey, TValue>): Map<TValue, TKey> {
    const inverted = new Map<TValue, TKey>(
        [...map]
        .map(([key, value]) => [value, key]),
    )

    return inverted
}

export function tryParseEnum<TEnum>(enumObject: TEnum, keyValue: unknown): TEnum[keyof TEnum] | undefined {
    if (typeof keyValue !== 'string') {
        return undefined
    }

    return tryGetEnumValueByName(enumObject, keyValue)
}

export function tryGetEnumValueByName<TEnum>(enumObject: TEnum, keyValue: string): TEnum[keyof TEnum] | undefined {
    const key = keyValue as keyof TEnum
    const value = enumObject[key]

    return value
}
