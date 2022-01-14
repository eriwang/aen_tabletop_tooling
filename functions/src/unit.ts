import * as yup from 'yup';

import { Attribute, getAbbrevFromAttr } from 'base_game_enums';

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

export class Unit {
    data: UnitData;

    constructor(data: UnitData) {
        this.data = data;
    }

    getAttribute(attribute: Attribute) : number {
        return (this.data as any)[getAbbrevFromAttr(attribute)];
    }

    getHpPerCon() : number {
        return this.data.hpPerCon;
    }

    getFpPerInt(): number {
        return this.data.fpPerInt;
    }

    getMovement(): number {
        return this.data.movement;
    }
}