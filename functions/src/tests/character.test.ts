import { Unit } from 'unit';
import { AttackType, Attribute, DamageType } from 'base_game_enums';
import { Character } from 'character';
import { Profile } from 'profile';
import { Armor, ResistanceStat } from 'armor';

import { when } from 'jest-when';

const mockUnit = { getAttribute: jest.fn(), hpPerCon: 10} as any as Unit;
const mockArmor = { getResistance: jest.fn() } as any as Armor;
const mockProfile = { getAttributeStatDiff: jest.fn(), getArmor: jest.fn() } as any as Profile;
when(mockProfile.getArmor).mockReturnValue(mockArmor);

test('getAttributeStat', () => {
    when(mockUnit.getAttribute).calledWith(Attribute.Dexterity).mockReturnValueOnce(50);
    when(mockProfile.getAttributeStatDiff).calledWith(Attribute.Dexterity).mockReturnValueOnce(10);

    const character = Character.build(mockUnit, mockProfile);
    expect(character.getAttributeStat(Attribute.Dexterity)).toBe(60);
});

test('getResistanceStat', () => {
    const resStat: ResistanceStat = {
        flat: 5,
        percent: 10
    };
    when(mockArmor.getResistance).calledWith(DamageType.Radiant).mockReturnValueOnce(resStat);

    const character = Character.build(mockUnit, mockProfile);
    expect(character.getResistanceStat(DamageType.Radiant)).toStrictEqual(resStat);
});

describe('getEvasiveStat', () => {
    test('valid', () => {
        const attrToValue = {
            [Attribute.Constitution]: 1,
            [Attribute.Strength]: 2,
            [Attribute.Dexterity]: 3,
            [Attribute.Wisdom]: 4,
            [Attribute.Intelligence]: 5,
            [Attribute.Charisma]: 6,
        };
        for (const [attr, value] of Object.entries(attrToValue)) {
            // when looping through a js object, attr is a string, we parse out the int version of it for the enum
            when(mockUnit.getAttribute).calledWith(parseInt(attr)).mockReturnValue(value);
            when(mockProfile.getAttributeStatDiff).calledWith(parseInt(attr)).mockReturnValue(1);
        }

        const character = Character.build(mockUnit, mockProfile);
        expect(character.getEvasiveStatForAttackType(AttackType.Strike)).toBe(4);  // ceil(0.75 * (1 + 2 + 1 + 1))
        expect(character.getEvasiveStatForAttackType(AttackType.Projectile)).toBe(7);  // ceil(0.75 * (3 + 4 + 1 + 1))
        expect(character.getEvasiveStatForAttackType(AttackType.Curse)).toBe(10);  // ceil(0.75 * (5 + 6 + 1 + 1))
    });

    test('invalid', () => {
        const character = Character.build(mockUnit, mockProfile);
        expect(() => character.getEvasiveStatForAttackType(-1 as AttackType)).toThrowError();
    });
});

test('hp values correct on build', () => {
    when(mockUnit.getAttribute).calledWith(Attribute.Constitution).mockReturnValueOnce(10);
    when(mockProfile.getAttributeStatDiff).calledWith(Attribute.Constitution).mockReturnValueOnce(2);

    const character = Character.build(mockUnit, mockProfile);
    expect(character.maxHp).toBe(120);
    expect(character.currentHp).toBe(120);
});