import { DamageType } from 'base_game_enums';
import { ResistanceStats } from 'resistance_stats';
import { enumerateEnumValues } from 'utils';

test('All stats initialized to 0 if none passed in', () => {
    const resistanceStats = new ResistanceStats();
    resistanceStats.buildResistanceDefault();
    for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
        expect(resistanceStats.get(damageType)).toStrictEqual({percent: 0, flat: 0});
    }
});

test('Stats initialized if armor is passed in', () => {
    const resistanceStats = new ResistanceStats();
    resistanceStats.buildResistancesArmor('test');

    for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
        const resistanceStat = resistanceStats.get(damageType);
        switch (damageType) {
            case DamageType.Slashing:
                expect(resistanceStat).toStrictEqual({percent: 0.1, flat: 1});
                continue;
            case DamageType.Bludgeoning:
                expect(resistanceStat).toStrictEqual({percent: 0.2, flat: 2});
                continue;
            case DamageType.Piercing:
                expect(resistanceStat).toStrictEqual({percent: 0.3, flat: 3});
                continue;
            case DamageType.Fire:
                expect(resistanceStat).toStrictEqual({percent: 0.4, flat: 4});
                continue;
            case DamageType.Water:
                expect(resistanceStat).toStrictEqual({percent: 0.5, flat: 5});
                continue;
            case DamageType.Air:
                expect(resistanceStat).toStrictEqual({percent: 0.6, flat: 6});
                continue;
            case DamageType.Earth:
                expect(resistanceStat).toStrictEqual({percent: 0.7, flat: 7});
                continue;
            case DamageType.Poison:
                expect(resistanceStat).toStrictEqual({percent: 0.8, flat: 8});
                continue;
            case DamageType.Radiant:
                expect(resistanceStat).toStrictEqual({percent: 0.9, flat: 9});
                continue;
            case DamageType.Necrotic:
                expect(resistanceStat).toStrictEqual({percent: 1.0, flat: 10});
                continue;
            case DamageType.Psychic:
                expect(resistanceStat).toStrictEqual({percent: 1.1, flat: 11});
                continue;
        }
    }
});