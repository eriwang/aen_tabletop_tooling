import { DamageType } from 'base_game_enums';
import { ResistanceStats } from 'resistance_stats';
import { enumerateEnumValues } from 'utils';

test('buildEmpty initializes stats to 0', () => {
    const resistanceStats = ResistanceStats.buildEmpty();
    for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
        expect(resistanceStats.get(damageType)).toStrictEqual({percent: 0, flat: 0});
    }
});
