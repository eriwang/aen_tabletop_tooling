import { AttributeStats } from 'attribute_stats';
import { Attribute, AttackType, DamageType, Skills } from 'base_game_enums';
import { Profile } from 'profile';
import { ResistanceStats } from 'resistance_stats';


// This is here for now since there's not much special about weapons (yet)
export interface Weapon {
    attribute: Attribute;
    attackType: AttackType;
    toHitMultiplier: number;
    difficultyClass: number;
    damageType: DamageType;
}

export class Character {
    attributeStats: AttributeStats;
    resistanceStats: ResistanceStats;
    weapon: Weapon;
    profile: Profile;
    health: number;
    focus: number;

    /**constructor(attrStats: AttributeStats, resStats: ResistanceStats, weap: Weapon, bonuses: SkillBonuses) {
        this.attributeStats = attrStats;
        this.resistanceStats = resStats;
        this.weapon = weap;
        this.skillBonus = bonuses;
        this.health = this.attributeStats.get(Attribute.Constitution) * 
    }*/

    constructor(unitName: string, profileName: string){
        this.attributeStats = new AttributeStats(unitName);
        this.profile = new Profile(profileName);
        this.health = this.attributeStats.get(Attribute.Constitution) * 13 //replace with profile HP/Con
        this.focus = this.attributeStats.get(Attribute.Intelligence) * 7 //replace with profile FP/Int
    }

    getSkillTotal(skill: Skills): number{

        let multiplier: number = 4;
        let bonus: number = this.profile.getSkillBonus(skill) * multiplier;


        switch(skill){
            case Skills.Endurance:
                return this.attributeStats.get(Attribute.Constitution) + bonus;

            case Skills.Athletics:
                return this.attributeStats.get(Attribute.Strength) + bonus;

            case Skills.Acrobatics:
            case Skills.SleightOfHand:
                return this.attributeStats.get(Attribute.Dexterity) + bonus;

            case Skills.Nature:
            case Skills.Religion:
            case Skills.Medicine:
            case Skills.Stealth: //Should this be wisdom?
            case Skills.Survival:
                return this.attributeStats.get(Attribute.Wisdom) + bonus;
            
            case Skills.Arcana:
            case Skills.History:
            case Skills.Investigation:
            case Skills.Culture:
                return this.attributeStats.get(Attribute.Intelligence) + bonus;

            case Skills.Deception:
            case Skills.Intimidation:
            case Skills.Performance:
            case Skills.Persuasion:
            case Skills.Insight:
                return this.attributeStats.get(Attribute.Charisma) + bonus;
        }

    }

}