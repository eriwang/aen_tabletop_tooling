import * as yup from 'yup';

import { Attribute, Skills } from 'base_game_enums';
import { attributesSchema, skillsSchema } from 'schemas';

export const profileSchema = yup.object().shape({
    abilities: yup.array(yup.string().required()).required(),
    attributeBonuses: attributesSchema,
    baseAttributes: attributesSchema,
    skillProficiency: skillsSchema,
    armor: yup.string().required(),
    level: yup.number().required(),
    race: yup.string().required(),
    class: yup.string().required(),
    weapons: yup.array(yup.string().required()).required(),
});

export interface ProfileData extends yup.InferType<typeof profileSchema> {}

export class Profile {
    data: ProfileData;

    constructor(data: ProfileData) {
        this.data = data;
    }

    getAttributeTotal(attr: Attribute) : number {
        const attributeDiff = this.data.attributeBonuses[attr] + this.data.level - 1;
        return attributeDiff + this.data.baseAttributes[attr];
    }

    getClass(): string {
        return this.data.class;
    }

    getRace(): string {
        return this.data.race;
    }

    getArmor() : string {
        return this.data.armor;
    }

    getLevel() {
        return this.data.level;
    }

    getWeapons(): string[] {
        return this.data.weapons;
    }

    getAbilities(): string[] {
        return this.data.abilities;
    }

    getSkillTotal(skill: Skills) : number {
        let bonus: number = this.data.skillProficiency[skill] * 4;

        switch (skill) {
            case Skills.Endurance:
                return this.getAttributeTotal(Attribute.CON) + bonus;

            case Skills.Athletics:
                return this.getAttributeTotal(Attribute.STR) + bonus;

            case Skills.Acrobatics:
            case Skills.SleightOfHand:
                return this.getAttributeTotal(Attribute.DEX) + bonus;

            case Skills.Nature:
            case Skills.Religion:
            case Skills.Medicine:
            case Skills.Stealth: // Should this be wisdom?
            case Skills.Survival:
                return this.getAttributeTotal(Attribute.WIS) + bonus;

            case Skills.Arcana:
            case Skills.History:
            case Skills.Investigation:
            case Skills.Culture:
                return this.getAttributeTotal(Attribute.INT) + bonus;

            case Skills.Deception:
            case Skills.Intimidation:
            case Skills.Performance:
            case Skills.Persuasion:
            case Skills.Insight:
                return this.getAttributeTotal(Attribute.CHAR) + bonus;
        }
    }

}