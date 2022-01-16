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
    data: ArmorData;

    constructor(data: ArmorData) {
        this.data = data;
    }

    getResistance(damageType: DamageType) : ResistanceStat {
        return this.data[damageType];
    }
}