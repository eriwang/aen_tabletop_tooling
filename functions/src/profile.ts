import * as yup from 'yup';
import { Attribute, DamageType, Skills } from 'base_game_enums';


export const profileSchema = yup.object().shape({
    abilities: yup.array(yup.string().required()).required(),
    attributeBonuses: yup.object().shape({
        CON: yup.number().required(),
        STR: yup.number().required(),
        DEX: yup.number().required(),
        WIS: yup.number().required(),
        INT: yup.number().required(),
        CHAR: yup.number().required(),
    }),
    unitAttributes: yup.object().shape({
        CON: yup.number().required(),
        STR: yup.number().required(),
        DEX: yup.number().required(),
        WIS: yup.number().required(),
        INT: yup.number().required(),
        CHAR: yup.number().required(),
    }),
    skillProficiency: yup.object().shape({
        Acrobatics: yup.number().optional(),
        Arcana: yup.number().optional(),
        Athletics: yup.number().optional(),
        Culture: yup.number().optional(),
        Deception: yup.number().optional(),
        Endurance: yup.number().optional(),
        History: yup.number().optional(),
        Insight: yup.number().optional(),
        Intimidation: yup.number().optional(),
        Investigation: yup.number().optional(),
        Medicine: yup.number().optional(),
        Nature: yup.number().optional(),
        Performance: yup.number().optional(),
        Persuasion: yup.number().optional(),
        Religion: yup.number().optional(),
        SleightOfHand: yup.number().optional(),
        Stealth: yup.number().optional(),
        Survival: yup.number().optional(),
    }),
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

    
    getAttributeStatDiff(attr: Attribute) : number {
        return this.data.attributeToStatDiff[attr] + this.data.level - 1;
    }

    getAttributeStatTotal(attr: Attribute) : number{
        return this.data.attributeToStatDiff[attr] + this.data.level + this.data.unitStats[attr] - 1;
    }

    getClass(): string {
        return this.data.class;
    }

    getRace(): string {
        return this.data.race;
    }
    
    getArmor() : string {

        if (this.data.armor === undefined){
            return "Naked";
        }

        return this.data.armor;
    }

    getWeapons(): string[] {
        return this.data.weapons;
    }

    getAbilities(): string[] {
        return this.data.abilities;
    }

    getSkillBonus(skill: Skills): number {
        return this.data.skillToPoints[skill];
    }

    getSkillTotal(skill: Skills) : number {
        let multiplier: number = 4;
        let bonus: number = this.getSkillBonus(skill) * multiplier;

        switch (skill) {
            case Skills.Endurance:
                return this.getAttributeStatTotal(Attribute.Constitution) + bonus;

            case Skills.Athletics:
                return this.getAttributeStatTotal(Attribute.Strength) + bonus;

            case Skills.Acrobatics:
            case Skills.SleightOfHand:
                return this.getAttributeStatTotal(Attribute.Dexterity) + bonus;

            case Skills.Nature:
            case Skills.Religion:
            case Skills.Medicine:
            case Skills.Stealth: // Should this be wisdom?
            case Skills.Survival:
                return this.getAttributeStatTotal(Attribute.Wisdom) + bonus;

            case Skills.Arcana:
            case Skills.History:
            case Skills.Investigation:
            case Skills.Culture:
                 return this.getAttributeStatTotal(Attribute.Intelligence) + bonus;

            case Skills.Deception:
            case Skills.Intimidation:
            case Skills.Performance:
            case Skills.Persuasion:
            case Skills.Insight:
                return this.getAttributeStatTotal(Attribute.Charisma) + bonus;
        }
    }

}