import * as yup from 'yup';

// TODO: not all of these will be mandatory due to actives/ passives/ ultimates being different. Some thought should go
//       into how the class itself should handle this.
export const abilitySchema = yup.object().shape({
    name: yup.string().required(),
    category: yup.string().required(),
    cooldown: yup.number().required(),
    description: yup.string().required(),
    fpCost: yup.number().required(),

    attribute: yup.string(),
    baseDamage: yup.number(),
    damageType: yup.string(),
    hitDC: yup.number(),
    range: yup.number(),
    attackType: yup.string(),
});

export interface AbilityData extends yup.InferType<typeof abilitySchema> {}