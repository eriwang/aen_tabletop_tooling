import { DamageType } from 'base_game_enums';
import { ResistanceStats } from 'resistance_stats';
import { enumerateEnumValues } from 'utils';

describe('ResistanceStats tests', () => {
    test('All stats initialized to 0 if none passed in', () => {
        const resistanceStats = new ResistanceStats();
        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            expect(resistanceStats.get(damageType)).toStrictEqual({percent: 0, flat: 0});
        }
    });

    test('Stats initialized if passed in', () => {
        const resistanceStats = new ResistanceStats({
            [DamageType.Bludgeoning]: {percent: 0.1, flat: 15},
            [DamageType.Fire]: {percent: 0.2, flat: 25}
        });

        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            const resistanceStat = resistanceStats.get(damageType);
            switch (damageType) {
                case DamageType.Bludgeoning:
                    expect(resistanceStat).toStrictEqual({percent: 0.1, flat: 15});
                    continue;
                case DamageType.Fire:
                    expect(resistanceStat).toStrictEqual({percent: 0.2, flat: 25});
                    continue;
                default:
                    expect(resistanceStat).toStrictEqual({percent: 0, flat: 0});
            }
        }
    });

    test('set', () => {
        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            const resistanceStats = new ResistanceStats();
            resistanceStats.set(damageType, {percent: 0.5, flat: 5});
            expect(resistanceStats.get(damageType)).toStrictEqual({percent: 0.5, flat: 5});
        }
    });
});