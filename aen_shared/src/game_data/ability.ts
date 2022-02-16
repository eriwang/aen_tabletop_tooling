import * as yup from 'yup';

function requireIfAndOnlyIfIsAttack(schema: yup.Schema) : yup.Schema {
    return schema.when('isAttack', {
        is: true,
        then: (schema: any) => schema.required(),
        otherwise: (schema: any) => schema.test(
            'does-not-exist', '${path} exists but should not', (value: any) => value === undefined)
    });
}

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

    attribute: requireIfAndOnlyIfIsAttack(yup.string()),
    baseDamage: requireIfAndOnlyIfIsAttack(yup.number()),
    damageMultiplier: requireIfAndOnlyIfIsAttack(yup.number()),
    toHitMultiplier: requireIfAndOnlyIfIsAttack(yup.number()),
    hitDC: requireIfAndOnlyIfIsAttack(yup.number()),
    range: requireIfAndOnlyIfIsAttack(yup.number()),
    attackType: requireIfAndOnlyIfIsAttack(yup.string()),
    damageType: requireIfAndOnlyIfIsAttack(yup.string()),
});

export interface AbilityData extends yup.InferType<typeof abilitySchema> {}