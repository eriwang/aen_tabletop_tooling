export function enumerateEnumValues<EnumClass>(enumClass: any) : EnumClass[] {
    return Object.values(enumClass)
        .filter(v => typeof(v) === 'string')
        .map((v) => enumClass[v as string]);
}

export function getNonNull<T>(value: T | null | undefined) : T {
    if (value === null || value === undefined) {
        throw `Expected nonNull value, but receieved ${value}`;
    }
    return value!;
}

export function arrayToMap<T, Value>(array: T[], getStringKey: (t: T) => string, getValue: (t: T) => Value)
    : Map<string, Value> {
    const map: Map<string, Value> = new Map();
    return array
        .map(t => {return {key: getStringKey(t), value: getValue(t)};})
        .reduce((m, kv) => {
            m.set(kv.key, kv.value);
            return m;
        }, map);
}