import { DamageType } from 'base_game_enums';
import { Armor } from 'armor';

describe('buildFromMap', () => {
    let resStatsMap : Map<string, number>;

    beforeEach(() => {
        resStatsMap = new Map<string, number>([
            ['Slashing%', 1], ['Slashing Flat', 2],
            ['Bludgeoning%', 3], ['Bludgeoning Flat', 4],
            ['Piercing%', 5], ['Piercing Flat', 6],
            ['Fire%', 7], ['Fire Flat', 8],
            ['Water%', 9], ['Water Flat', 10],
            ['Air%', 11], ['Air Flat', 12],
            ['Earth%', 13], ['Earth Flat', 14],
            ['Poison%', 15], ['Poison Flat', 16],
            ['Radiant%', 17], ['Radiant Flat', 18],
            ['Necrotic%', 19], ['Necrotic Flat', 20],
            ['Psychic%', 21], ['Psychic Flat', 22],
        ]);
    });

    test('initializes correctly', () => {
        const armor = Armor.buildFromMap(resStatsMap);
        expect(armor.getResistance(DamageType.Slashing)).toStrictEqual({percent: 0.01, flat: 2});
        expect(armor.getResistance(DamageType.Bludgeoning)).toStrictEqual({percent: 0.03, flat: 4});
        expect(armor.getResistance(DamageType.Piercing)).toStrictEqual({percent: 0.05, flat: 6});
        expect(armor.getResistance(DamageType.Fire)).toStrictEqual({percent: 0.07, flat: 8});
        expect(armor.getResistance(DamageType.Water)).toStrictEqual({percent: 0.09, flat: 10});
        expect(armor.getResistance(DamageType.Air)).toStrictEqual({percent: 0.11, flat: 12});
        expect(armor.getResistance(DamageType.Earth)).toStrictEqual({percent: 0.13, flat: 14});
        expect(armor.getResistance(DamageType.Poison)).toStrictEqual({percent: 0.15, flat: 16});
        expect(armor.getResistance(DamageType.Radiant)).toStrictEqual({percent: 0.17, flat: 18});
        expect(armor.getResistance(DamageType.Necrotic)).toStrictEqual({percent: 0.19, flat: 20});
        expect(armor.getResistance(DamageType.Psychic)).toStrictEqual({percent: 0.21, flat: 22});
    });

    test('throws when flat damage type not found', () => {
        resStatsMap.delete('Psychic Flat');
        expect(() => Armor.buildFromMap(resStatsMap)).toThrowError();
    });

    test('throws when percent damage type not found', () => {
        resStatsMap.delete('Psychic%');
        expect(() => Armor.buildFromMap(resStatsMap)).toThrowError();
    });
});
