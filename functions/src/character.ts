import { Unit } from 'unit';
import { AttackType, Attribute, DamageType } from 'base_game_enums';
import { Profile } from 'profile';
import { ResistanceStat } from 'armor';
import { enumerateEnumValues } from 'utils';
import { Weapon } from 'weapon';

export class Character {
    attributeToStat: Record<Attribute, number>;
    resistanceToResStat: Record<DamageType, ResistanceStat>;
    maxHp: number;
    currentHp: number;
    weapons: Weapon[];

    constructor(attrToStat: Record<Attribute, number>, resToResStat: Record<DamageType, ResistanceStat>,
        maxHp: number, currentHp: number, weaps: Weapon[]) {
        this.attributeToStat = attrToStat;
        this.resistanceToResStat = resToResStat;
        this.maxHp = maxHp;
        this.currentHp = currentHp;
        this.weapons = weaps;
    }

    static build(unit: Unit, prof: Profile) : Character {
        const attributeToStat = {} as Record<Attribute, number>;
        for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
            attributeToStat[attribute] = unit.getAttribute(attribute) + prof.getAttributeStatDiff(attribute);
        }

        const resistanceToResStat = {} as Record<DamageType, ResistanceStat>;
        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            resistanceToResStat[damageType] = prof.getArmor().getResistance(damageType);
        }

        // TODO
        return new Character(attributeToStat, resistanceToResStat, 0, 0, []);
    }

    getAttributeStat(attr: Attribute) : number {
        return this.attributeToStat[attr];
    }

    getResistanceStat(dmgType: DamageType) : ResistanceStat {
        return this.resistanceToResStat[dmgType];
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
            case AttackType.Curse:  // willpower
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