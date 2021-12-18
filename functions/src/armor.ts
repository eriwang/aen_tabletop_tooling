import { DamageType } from 'base_game_enums';
import { enumerateEnumValues, getNonNull } from 'utils';

export interface ResistanceStat {
    percent: number;
    flat: number;
}

export class Armor {
    damageTypeToResistance: Record<DamageType, ResistanceStat>;

    constructor(damageTypeToResistance: Record<DamageType, ResistanceStat>) {
        this.damageTypeToResistance = damageTypeToResistance;
    }

    static buildFromMap(map: Map<string, any>) : Armor {
        const damageTypeToResistance = {} as Record<DamageType, ResistanceStat>;
        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            const damageTypeStr = DamageType[damageType];
            damageTypeToResistance[damageType] = {
                percent: parseInt(getNonNull(map.get(`${damageTypeStr}%`))) / 100,
                flat: parseInt(getNonNull(map.get(`${damageTypeStr} Flat`))),
            };
        }

        return new Armor(damageTypeToResistance);
    }

    getResistance(damageType: DamageType) : ResistanceStat {
        return this.damageTypeToResistance[damageType];
    }
}