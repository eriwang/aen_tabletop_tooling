import * as yup from 'yup';

import { Armor } from 'armor';
import { Attribute } from 'base_game_enums';

export const profileSchema = yup.object().shape({
    abilities: yup.array(yup.string()).required(),
    attributeToStat: yup.object().shape({
        CON: yup.number().required(),
        STR: yup.number().required(),
        DEX: yup.number().required(),
        WIS: yup.number().required(),
        INT: yup.number().required(),
        CHAR: yup.number().required(),
    }),
    armor: yup.string().required(),
    level: yup.number().required(),
    weapons: yup.array(yup.string()).required(),
    // skillToPoints map
});

export interface ProfileData extends yup.InferType<typeof profileSchema> {}

export class Profile {
    level: number;
    attributeToStatDiff: Record<Attribute, number>;
    armor: Armor;

    // skills: Record<Skills, number>;

    constructor(level: number, attrToStatDiff: Record<Attribute, number>, armor: Armor) {
        this.level = level;
        this.attributeToStatDiff = attrToStatDiff;
        this.armor = armor;
    }

    getAttributeStatDiff(attr: Attribute) : number {
        return this.attributeToStatDiff[attr] + this.level - 1;
    }

    getArmor() : Armor {
        return this.armor;
    }

    // getSkillBonus(skill: Skills): number {
    //     return this.skills[skill];
    // }
}