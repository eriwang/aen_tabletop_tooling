import { AttributeStats } from 'attribute_stats';
import { Attribute, Skills, AttackType, DamageType } from 'base_game_enums';
import { Profile } from 'profile';
import { ResistanceStats } from 'resistance_stats';
import { Weapon } from 'weapon';


export class Character {
    attributeStats: AttributeStats;
    resistanceStats: ResistanceStats;
    weapon: Weapon;
    profile: Profile;

    constructor(attrStats: AttributeStats, resStats: ResistanceStats, weap: Weapon, prof: Profile) {
        this.attributeStats = attrStats;
        this.resistanceStats = resStats;
        this.weapon = weap;
        this.profile = prof;  // as of time of writing, unused in real code
    }

    // as of writing, unused and untested
    getSkillTotal(skill: Skills): number {
        let multiplier: number = 4;
        let bonus: number = this.profile.getSkillBonus(skill) * multiplier;

        switch (skill) {
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
            case Skills.Stealth: // Should this be wisdom?
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