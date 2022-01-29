import * as yup from 'yup';

import { resistancesSchema } from 'schemas';

export const armorSchema = yup.object().shape({
    name: yup.string().required(),
    resistanceToFlat: resistancesSchema,
    resistanceToPercent: resistancesSchema,
});

export interface ArmorData extends yup.InferType<typeof armorSchema> {}

export interface ResistanceStat {
    percent: number;
    flat: number;
}