import * as yup from 'yup';

export const attributesSchema = yup.object().shape({
    CON: yup.number().required(),
    STR: yup.number().required(),
    DEX: yup.number().required(),
    WIS: yup.number().required(),
    INT: yup.number().required(),
    CHAR: yup.number().required(),
});

export interface AttributesData extends yup.InferType<typeof attributesSchema> {}

export const resistancesSchema = yup.object().shape({
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
});

export const skillsSchema = yup.object().shape({
    Acrobatics: yup.number().required(),
    Arcana: yup.number().required(),
    Athletics: yup.number().required(),
    Culture: yup.number().required(),
    Deception: yup.number().required(),
    Endurance: yup.number().required(),
    History: yup.number().required(),
    Insight: yup.number().required(),
    Intimidation: yup.number().required(),
    Investigation: yup.number().required(),
    Medicine: yup.number().required(),
    Nature: yup.number().required(),
    Performance: yup.number().required(),
    Persuasion: yup.number().required(),
    Religion: yup.number().required(),
    SleightOfHand: yup.number().required(),
    Stealth: yup.number().required(),
    Survival: yup.number().required(),
});

export interface SkillsData extends yup.InferType<typeof skillsSchema> {}