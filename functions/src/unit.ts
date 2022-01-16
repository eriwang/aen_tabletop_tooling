import * as yup from 'yup';

export const unitSchema = yup.object().shape({
    CON: yup.number().required(),
    STR: yup.number().required(),
    DEX: yup.number().required(),
    WIS: yup.number().required(),
    INT: yup.number().required(),
    CHAR: yup.number().required(),
    hpPerCon: yup.number().required(),
    fpPerInt: yup.number().required(),
    movement: yup.number().required(),
});

export interface UnitData extends yup.InferType<typeof unitSchema> {}