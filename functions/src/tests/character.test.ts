import { Attribute, DamageType } from 'base_game_enums';
import { Character } from 'character';
import { getCharacterRepr } from 'tests/test_data';

test('getAttributeStat', () => {
    expect(new Character(getCharacterRepr()).getAttributeStat(Attribute.DEX)).toBe(3);
});

test('getResistanceStat', () => {
    expect(new Character(getCharacterRepr()).getResistanceStat(DamageType.Bludgeoning)).toStrictEqual({
        flat: 2,
        percent: 20,
    });
});

/*
TODO FOR ERIC TO FIX

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
            when(mockProfile.getAttributeDiff).calledWith(parseInt(attr)).mockReturnValue(1);
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
});*/

test('hp values', () => {
    const character = new Character(getCharacterRepr());
    expect(character.getMaxHp()).toBe(100);
    expect(character.getCurrentHp()).toBe(90);
});