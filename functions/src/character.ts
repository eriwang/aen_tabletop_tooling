import * as yup from 'yup';

import { Unit } from 'unit';
import { AttackType, Attribute, DamageType, getAbbrevFromAttr } from 'base_game_enums';
import { Profile } from 'profile';
import { Armor, ArmorData, ResistanceStat } from 'armor';
import { enumerateEnumValues } from 'utils';
import { WeaponData, weaponSchema } from 'weapon';
import { abilitySchema } from 'ability';

export const characterSchema = yup.object().shape({
    attributes: yup.object().shape({
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
    skills: yup.object().shape({
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
    maxHp: yup.number().required(),
    currentHp: yup.number().required(),
    level: yup.number().required(),
    initiative: yup.number().required(),
    cooldowns: yup.string().required(),
    statues: yup.string().required(),
    armor: yup.string().required(),
    race: yup.string().required(),
    class: yup.string().required(),
    weapons: yup.array(weaponSchema).required(),
    abilities: yup.array(abilitySchema).required(),
});

export interface CharacterData extends yup.InferType<typeof characterSchema> {}

export class Character {
    data: CharacterData;

    constructor(data: CharacterData) {
        this.data = data;
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

    getMaxHp() : number {
        return this.data.maxHp;
    }

    getCurrentHp() : number {
        return this.data.currentHp;
    }

    setCurrentHp(hp: number) {
        this.data.currentHp = hp;
    }

    getWeapons() : WeaponData[] {
        return this.data.weapons;
    }
}