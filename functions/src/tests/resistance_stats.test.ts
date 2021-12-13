import { DamageType } from 'base_game_enums';
import { ResistanceStats } from 'resistance_stats';

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
        const resStats = ResistanceStats.buildFromMap(resStatsMap);
        expect(resStats.get(DamageType.Slashing)).toStrictEqual({percent: 0.01, flat: 2});
        expect(resStats.get(DamageType.Bludgeoning)).toStrictEqual({percent: 0.03, flat: 4});
        expect(resStats.get(DamageType.Piercing)).toStrictEqual({percent: 0.05, flat: 6});
        expect(resStats.get(DamageType.Fire)).toStrictEqual({percent: 0.07, flat: 8});
        expect(resStats.get(DamageType.Water)).toStrictEqual({percent: 0.09, flat: 10});
        expect(resStats.get(DamageType.Air)).toStrictEqual({percent: 0.11, flat: 12});
        expect(resStats.get(DamageType.Earth)).toStrictEqual({percent: 0.13, flat: 14});
        expect(resStats.get(DamageType.Poison)).toStrictEqual({percent: 0.15, flat: 16});
        expect(resStats.get(DamageType.Radiant)).toStrictEqual({percent: 0.17, flat: 18});
        expect(resStats.get(DamageType.Necrotic)).toStrictEqual({percent: 0.19, flat: 20});
        expect(resStats.get(DamageType.Psychic)).toStrictEqual({percent: 0.21, flat: 22});
    });

    test('throws when flat damage type not found', () => {
        resStatsMap.delete('Psychic Flat');
        expect(() => ResistanceStats.buildFromMap(resStatsMap)).toThrowError();
    });

    test('throws when percent damage type not found', () => {
        resStatsMap.delete('Psychic%');
        expect(() => ResistanceStats.buildFromMap(resStatsMap)).toThrowError();
    });
});
