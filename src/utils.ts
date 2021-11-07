export function enumerateEnumValues<EnumClass>(enumClass: any) : EnumClass[] {
    return Object.values(enumClass)
        .filter(v => typeof(v) === 'string')
        .map((v) => enumClass[v as string])
}
