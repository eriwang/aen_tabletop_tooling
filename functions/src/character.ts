import * as yup from 'yup';

import { Unit } from 'unit';
import { AttackType, Attribute, DamageType, getAbbrevFromAttr } from 'base_game_enums';
import { Profile } from 'profile';
import { ResistanceStat } from 'armor';
import { enumerateEnumValues } from 'utils';

const weaponSchema = yup.object().shape({
    name: yup.string().required(),
    attribute: yup.number().required(),
    attackType: yup.number().required(),
    damageType: yup.number().required(),
    baseDamage: yup.number().required(),
    toHitMultiplier: yup.number().required(),
    damageMultiplier: yup.number().required(),
    difficultyClass: yup.number().required(),
});

export const characterSchema = yup.object().shape({
    attributeToStat: yup.object().shape({
        CON: yup.number().required(),
        STR: yup.number().required(),
        DEX: yup.number().required(),
        WIS: yup.number().required(),
        INT: yup.number().required(),
        CHAR: yup.number().required(),
    }),
    resistanceToFlatStat: yup.object().shape({
        Slashing: yup.number().required(),
        Bludgeoning: yup.number().required(),
        Piercing: yup.number().required(),
        Fire: yup.number().required(),
        Water: yup.number().required(),
        Air: yup.number().required(),
        Earth: yup.number().required(),
        Poison: yup.number().required(),
        Radiant: yup.number().required(),
        Necrotic: yup.number().required(),
        Psychic: yup.number().required(),
    }),
    resistanceToPercentStat: yup.object().shape({
        Slashing: yup.number().required(),
        Bludgeoning: yup.number().required(),
        Piercing: yup.number().required(),
        Fire: yup.number().required(),
        Water: yup.number().required(),
        Air: yup.number().required(),
        Earth: yup.number().required(),
        Poison: yup.number().required(),
        Radiant: yup.number().required(),
        Necrotic: yup.number().required(),
        Psychic: yup.number().required(),
    }),
    maxHp: yup.number().required(),
    currentHp: yup.number().required(),
    weapons: yup.array(weaponSchema).required(),
});

export interface WeaponData extends yup.InferType<typeof weaponSchema> {}

export interface CharacterData extends yup.InferType<typeof characterSchema> {}

export class Character {
    data: CharacterData;
    maxHp: number;
    currentHp: number;

    constructor(charData: CharacterData) {
        this.data = charData;
        this.maxHp = charData.maxHp;
        this.currentHp = charData.currentHp;
    }

    static build(unit: Unit, prof: Profile) : Character {
        const attributeToStat: any = {};
        for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
            attributeToStat[getAbbrevFromAttr(attribute)] =
                unit.getAttribute(attribute) + prof.getAttributeStatDiff(attribute);
        }

        const resistanceToFlatStat: any = {};
        const resistanceToPercentStat: any = {};
        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            const resStat = prof.getArmor().getResistance(damageType);
            const damageTypeStr = DamageType[damageType];
            resistanceToFlatStat[damageTypeStr] = resStat.flat;
            resistanceToPercentStat[damageTypeStr] = resStat.percent;
        }

        // For simplicity, set current HP to max HP every time we build a character
        const maxHp = attributeToStat['CON'] * unit.hpPerCon;
        const data = {
            attributeToStat: attributeToStat,
            resistanceToFlatStat: resistanceToFlatStat,
            resistanceToPercentStat: resistanceToPercentStat,
            maxHp: maxHp,
            currentHp: maxHp,
        };

        return new Character(data as any as CharacterData);
    }

    getAttributeStat(attr: Attribute) : number {
        return (this.data.attributeToStat as any)[getAbbrevFromAttr(attr)];
    }

    getResistanceStat(dmgType: DamageType) : ResistanceStat {
        const damageTypeStr = DamageType[dmgType];
        return {
            percent: (this.data.resistanceToPercentStat as any)[damageTypeStr],
            flat: (this.data.resistanceToFlatStat as any)[damageTypeStr],
        };
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