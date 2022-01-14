import * as yup from 'yup';

export const weaponSchema = yup.object().shape({
    name: yup.string().required(),
    attribute: yup.number().required(),  // TODO: string transformed to enum
    attackType: yup.number().required(),  // TODO: string transformed to enum
    damageType: yup.number().required(),  // TODO: string transformed to enum
    baseDamage: yup.number().required(),
    toHitMultiplier: yup.number().required(),
    damageMultiplier: yup.number().required(),
    difficultyClass: yup.number().required(),
});

export interface WeaponData extends yup.InferType<typeof weaponSchema> {}
