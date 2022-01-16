import * as yup from 'yup';

import { DamageType } from 'base_game_enums';
import { enumerateEnumValues, getNonNull } from 'utils';

export const armorSchema = yup.object().shape({
    name: yup.string().required(),
    resistanceToFlatStat: yup.object().shape({
        Slashing: yup.number().required(),
        Bludgeoning: yup.number().required(),
        Piercing: yup.number().required(),
        Fire: yup.number().required(),
        Water: yup.number().required(),
        Air: yup.number().required(),
        Earth: yup.number().required(),
        Poison: yup.number().required(),
        Radiant: yup.number().required(),
        Necrotic: yup.number().required(),
        Psychic: yup.number().required(),
    }),
    resistanceToPercentStat: yup.object().shape({
        Slashing: yup.number().required(),
        Bludgeoning: yup.number().required(),
        Piercing: yup.number().required(),
        Fire: yup.number().required(),
        Water: yup.number().required(),
        Air: yup.number().required(),
        Earth: yup.number().required(),
        Poison: yup.number().required(),
        Radiant: yup.number().required(),
        Necrotic: yup.number().required(),
        Psychic: yup.number().required(),
    }),
});

export interface ArmorData extends yup.InferType<typeof armorSchema> {}

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