import { AttributeStats } from 'attribute_stats';
import { Attribute, Skills, AttackType, DamageType } from 'base_game_enums';
import { Profile } from 'profile';
import { ResistanceStat, ResistanceStats } from 'resistance_stats';
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

    getAttributeStat(attr: Attribute) : number {
        return this.attributeStats.get(attr);
    }

    getResistanceStat(dmgType: DamageType) : ResistanceStat {
        return this.resistanceStats.get(dmgType);
    }

    getEvasiveStatForAttackType(atkType: AttackType) : number {
        let statSum: number;
        switch (atkType) {
            case AttackType.Strike:  // fortitude
                statSum = this.attributeStats.get(Attribute.Constitution) + this.attributeStats.get(Attribute.Strength);
                break;
            case AttackType.Projectile:  // reflex
                statSum = this.attributeStats.get(Attribute.Dexterity) + this.attributeStats.get(Attribute.Wisdom);
                break;
            case AttackType.Curse:  // willpower:
                statSum = this.attributeStats.get(Attribute.Intelligence) + this.attributeStats.get(Attribute.Charisma);
                break;

            default:
                throw `Unknown attackType ${atkType}`;
        }

        return Math.ceil(0.75 * statSum);
    }

    // as of writing, unused and untested
    getSkillTotal(skill: Skills) : number {
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