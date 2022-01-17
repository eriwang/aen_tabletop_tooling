import * as yup from 'yup';

export const classSchema = yup.object().shape({
    name: yup.string().required(),
    hpPerCon: yup.number().required(),
    fpPerInt: yup.number().required()
});

export interface ClassData extends yup.InferType<typeof classSchema> {}