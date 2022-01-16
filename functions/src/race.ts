import * as yup from 'yup';

export const raceSchema = yup.object().shape({
    movement: yup.number().required(),
});

export interface RaceData extends yup.InferType<typeof raceSchema> {}