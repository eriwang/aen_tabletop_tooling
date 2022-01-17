import { AttackType, Attribute, DamageType } from 'base_game_enums';
import * as yup from 'yup';

export const weaponSchema = yup.object().shape({
    name: yup.string().required(),
    attribute: yup.string().oneOf(Object.values(Attribute)).required(),
    attackType: yup.string().oneOf(Object.values(AttackType)).required(),
    damageType: yup.string().oneOf(Object.values(DamageType)).required(),
    baseDamage: yup.number().required(),
    toHitMultiplier: yup.number().required(),
    damageMultiplier: yup.number().required(),
    hitDC: yup.number().required(),
    range: yup.number().required(),
});

export interface WeaponData extends yup.InferType<typeof weaponSchema> {}
