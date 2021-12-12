import { AttributeStats } from 'attribute_stats';
import { AttackType, Attribute, DamageType, Skills } from 'base_game_enums';
import { Character } from 'character';
import { Profile } from 'profile';
import { ResistanceStat, ResistanceStats } from 'resistance_stats';

import { when } from 'jest-when';

const mockAttrStats = { get: jest.fn() } as any as AttributeStats;
const mockResStats = { get: jest.fn() } as any as ResistanceStats;
const mockProfile = {} as any as Profile;  // unused for now

const character = new Character(mockAttrStats, mockResStats, mockProfile);

test('getAttributeStat', () => {
    when(mockAttrStats.get).expectCalledWith(Attribute.Dexterity).mockReturnValueOnce(50);
    expect(character.getAttributeStat(Attribute.Dexterity)).toBe(50);
});

test('getResistanceStat', () => {
    const resStat: ResistanceStat = {
        flat: 5,
        percent: 10
    };

    when(mockResStats.get).expectCalledWith(DamageType.Radiant).mockReturnValueOnce(resStat);
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
            when(mockAttrStats.get).calledWith(parseInt(attr)).mockReturnValue(value);
        }

        expect(character.getEvasiveStatForAttackType(AttackType.Strike)).toBe(3);  // ceil(0.75 * (1 + 2))
        expect(character.getEvasiveStatForAttackType(AttackType.Projectile)).toBe(6);  // ceil(0.75 * (3 + 4))
        expect(character.getEvasiveStatForAttackType(AttackType.Curse)).toBe(9);  // ceil(0.75 * (5 + 6))
    });

    test('invalid', () => {
        expect(() => character.getEvasiveStatForAttackType(-1 as AttackType)).toThrowError();
    });
});