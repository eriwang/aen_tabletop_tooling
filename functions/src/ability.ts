import * as yup from 'yup';

// TODO: not all of these will be mandatory due to actives/ passives/ ultimates being different. Some thought should go
//       into how the class itself should handle this.
export const abilitySchema = yup.object().shape({
    attribute: yup.number().required(),  // TODO: string transformed to enum
    baseDamage: yup.number().required(),
    category: yup.string().required(),  // TODO: string transformed to enum, passive basic or ult
    cooldown: yup.number().required(),
    damageType: yup.number().required(),  // TODO: string transformed to enum
    description: yup.string().required(),
    fpCost: yup.number().required(),
    hitDC: yup.number().required(),
    range: yup.number().required(),
    attackType: yup.number().required(),  // TODO: string transformed to enum, I think this is "type" in console atm
});

export interface AbilityData extends yup.InferType<typeof abilitySchema> {}