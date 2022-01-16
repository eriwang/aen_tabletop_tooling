import * as yup from 'yup';

export const classSchema = yup.object().shape({
    hpPerCon: yup.number().required(),
    fpPerInt: yup.number().required()
})

export interface ClassData extends yup.InferType<typeof classSchema> {}