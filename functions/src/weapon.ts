import { Attribute } from 'base_game_enums';
import * as yup from 'yup';

export const weaponSchema = yup.object().shape({
    name: yup.string().required(),
    attribute: yup.string().oneOf(Object.values(Attribute)).required(),
    attackType: yup.number().required(),  // TODO: string transformed to enum
    damageType: yup.number().required(),  // TODO: string transformed to enum
    baseDamage: yup.number().required(),
    toHitMultiplier: yup.number().required(),
    damageMultiplier: yup.number().required(),
    difficultyClass: yup.number().required(),
});

export interface WeaponData extends yup.InferType<typeof weaponSchema> {}
