import * as yup from 'yup';
import { Attribute, DamageType, Skills } from 'base_game_enums';
import { Armor, ResistanceStat } from 'armor';


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
    skillToPoints: yup.object().shape({
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
    }),
    armor: yup.string().required(),
    level: yup.number().required(),
    weapon: yup.array(yup.string()).required(),
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
    
    getArmor() : string {

        //We need to decide if armors are flat or percentage or both
        //let armor: Armor = new Armor({} as Record<DamageType, ResistanceStat>)

        return this.data.armor;
    }

    getWeapon(): string[] {
        return this.data.weapons;
    }

    getSkillBonus(skill: Skills): number {
        return this.data.skillToPoints[skill];
    }
}