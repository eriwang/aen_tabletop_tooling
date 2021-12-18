import { Unit } from 'unit';
import { Attribute, AttackType, DamageType } from 'base_game_enums';
import { Profile } from 'profile';
import { ResistanceStat, ResistanceStats } from 'resistance_stats';

export class Character {
    unit: Unit;
    resistanceStats: ResistanceStats;
    profile: Profile;

    constructor(unit: Unit, resStats: ResistanceStats, prof: Profile) {
        this.unit = unit;
        this.resistanceStats = resStats;
        this.profile = prof;  // as of time of writing, unused in real code
    }

    getAttributeStat(attr: Attribute) : number {
        return this.unit.get(attr);
    }

    getResistanceStat(dmgType: DamageType) : ResistanceStat {
        return this.resistanceStats.get(dmgType);
    }

    getEvasiveStatForAttackType(atkType: AttackType) : number {
        let statSum: number;
        switch (atkType) {
            case AttackType.Strike:  // fortitude
                statSum = this.unit.get(Attribute.Constitution) + this.unit.get(Attribute.Strength);
                break;
            case AttackType.Projectile:  // reflex
                statSum = this.unit.get(Attribute.Dexterity) + this.unit.get(Attribute.Wisdom);
                break;
            case AttackType.Curse:  // willpower:
                statSum = this.unit.get(Attribute.Intelligence) + this.unit.get(Attribute.Charisma);
                break;

            default:
                throw `Unknown attackType ${atkType}`;
        }

        return Math.ceil(0.75 * statSum);
    }

    // as of writing, unused and untested
    // getSkillTotal(skill: Skills) : number {
    //     let multiplier: number = 4;
    //     let bonus: number = this.profile.getSkillBonus(skill) * multiplier;

    //     switch (skill) {
    //         case Skills.Endurance:
    //             return this.unit.get(Attribute.Constitution) + bonus;

    //         case Skills.Athletics:
    //             return this.unit.get(Attribute.Strength) + bonus;

    //         case Skills.Acrobatics:
    //         case Skills.SleightOfHand:
    //             return this.unit.get(Attribute.Dexterity) + bonus;

    //         case Skills.Nature:
    //         case Skills.Religion:
    //         case Skills.Medicine:
    //         case Skills.Stealth: // Should this be wisdom?
    //         case Skills.Survival:
    //             return this.unit.get(Attribute.Wisdom) + bonus;

    //         case Skills.Arcana:
    //         case Skills.History:
    //         case Skills.Investigation:
    //         case Skills.Culture:
    //             return this.unit.get(Attribute.Intelligence) + bonus;

    //         case Skills.Deception:
    //         case Skills.Intimidation:
    //         case Skills.Performance:
    //         case Skills.Persuasion:
    //         case Skills.Insight:
    //             return this.unit.get(Attribute.Charisma) + bonus;
    //     }
    // }
}