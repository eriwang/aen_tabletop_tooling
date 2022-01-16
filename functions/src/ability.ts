import * as yup from 'yup';

const requireWhenIsAttack = {
    is: true,
    then: (schema: any) => schema.required()
};

/*
Aside from the classifications of "Basic", "Passive", and "Ultimate", there are three more classifications of
abilities based on targeting and damage:

- Abilities where you target an enemy and deal damage (e.g. a lightning bolt at an enemy that can miss)
- Abilities where you target an enemy and deal no damage (e.g. inflicting some status on some enemy which can miss)
- Abilities where you don't target and enemy or deal damage (e.g. healing an ally)

For the first two cases, the isAttack boolean is set to true. For the second case, damage values will be set to 0, but
still exist. This lets us process these abilities as attacks normally.
*/
export const abilitySchema = yup.object().shape({
    name: yup.string().required(),
    category: yup.string().required(),
    cooldown: yup.number().required(),
    description: yup.string().required(),
    fpCost: yup.number().required(),
    isAttack: yup.boolean().required(),

    attribute: yup.string().when('isAttack', requireWhenIsAttack),
    baseDamage: yup.number().when('isAttack', requireWhenIsAttack),
    damageMultiplier: yup.number().when('isAttack', requireWhenIsAttack),
    hitDC: yup.number().when('isAttack', requireWhenIsAttack),
    range: yup.number().when('isAttack', requireWhenIsAttack),
    attackType: yup.string().when('isAttack', requireWhenIsAttack),
    damageType: yup.string().when('isAttack', requireWhenIsAttack),
});

export interface AbilityData extends yup.InferType<typeof abilitySchema> {}