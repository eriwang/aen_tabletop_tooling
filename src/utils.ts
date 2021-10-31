export function enumerateEnumValues(enumClass: any) : any[] {
    return Object.values(enumClass)
        .filter(v => typeof(v) === 'string')
        .map((v) => enumClass[v as string]);
}