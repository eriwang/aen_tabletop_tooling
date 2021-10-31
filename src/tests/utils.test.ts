import { enumerateEnumValues } from 'utils';

test('enumerateEnumValues', () => {
    enum NumEnum {
        One,
        Two,
        Three,
    }

    enum StrEnum {
        A = 'A',
        B = 'B',
        C = 'C',
    }

    const numEnumValues : NumEnum[] = enumerateEnumValues(NumEnum);
    expect(numEnumValues.length).toBe(3);
    expect(numEnumValues.includes(NumEnum.One)).toBe(true);
    expect(numEnumValues.includes(NumEnum.Two)).toBe(true);
    expect(numEnumValues.includes(NumEnum.Three)).toBe(true);

    const strEnumValues = enumerateEnumValues(StrEnum);
    expect(strEnumValues.length).toBe(3);
    expect(strEnumValues.includes(StrEnum.A)).toBe(true);
    expect(strEnumValues.includes(StrEnum.B)).toBe(true);
    expect(strEnumValues.includes(StrEnum.C)).toBe(true);
});