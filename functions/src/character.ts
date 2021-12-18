import { Unit } from 'unit';
import { Attribute, AttackType, DamageType } from 'base_game_enums';
import { Profile } from 'profile';
import { ResistanceStat, Armor } from 'armor';

export class Character {
    unit: Unit;
    armor: Armor;
    profile: Profile;

    constructor(unit: Unit, armor: Armor, prof: Profile) {
        this.unit = unit;
        this.armor = armor;
        this.profile = prof;
    }

    getAttributeStat(attr: Attribute) : number {
        return this.unit.getAttribute(attr) + this.profile.getAttributeStatDiff(attr);
    }

    getResistanceStat(dmgType: DamageType) : ResistanceStat {
        return this.armor.getResistance(dmgType);
    }

    getEvasiveStatForAttackType(atkType: AttackType) : number {
        let statSum: number;
        switch (atkType) {
            case AttackType.Strike:  // fortitude
                statSum = this.getAttributeStat(Attribute.Constitution) + this.getAttributeStat(Attribute.Strength);
                break;
            case AttackType.Projectile:  // reflex
                statSum = this.getAttributeStat(Attribute.Dexterity) + this.getAttributeStat(Attribute.Wisdom);
                break;
            case AttackType.Curse:  // willpower:
                statSum = this.getAttributeStat(Attribute.Intelligence) + this.getAttributeStat(Attribute.Charisma);
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