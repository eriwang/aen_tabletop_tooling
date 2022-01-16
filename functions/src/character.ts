import * as yup from 'yup';

import { AttackType, Attribute, DamageType } from 'base_game_enums';
import { WeaponData, weaponSchema } from 'weapon';
import { abilitySchema } from 'ability';
import { ResistanceStat } from 'armor';
import { attributesSchema, resistancesSchema, skillsSchema } from 'schemas';

export const characterSchema = yup.object().shape({
    name: yup.string().required(),
    attributes: attributesSchema,
    resistanceToFlat: resistancesSchema,
    resistanceToPercent: resistancesSchema,
    skills: skillsSchema,
    maxHp: yup.number().required(),
    currentHp: yup.number().required(),
    maxFp: yup.number().required(),
    currentFp: yup.number().required(),
    level: yup.number().required(),
    initiative: yup.number().required(),
    cooldowns: yup.string().required(),
    statuses: yup.string().required(),
    armor: yup.string().required(),
    race: yup.string().required(),
    class: yup.string().required(),
    movement: yup.number().required(),
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
        return this.data.attributes[attr];
    }

    getResistanceStat(dmgType: DamageType) : ResistanceStat {
        const damageTypeStr = DamageType[dmgType];
        return {
            percent: (this.data.resistanceToPercent as any)[damageTypeStr],
            flat: (this.data.resistanceToFlat as any)[damageTypeStr],
        };
    }

    getEvasiveStatForAttackType(atkType: AttackType) : number {
        let statSum: number;
        switch (atkType) {
            case AttackType.Strike:  // fortitude
                statSum = this.getAttributeStat(Attribute.CON) + this.getAttributeStat(Attribute.STR);
                break;
            case AttackType.Projectile:  // reflex
                statSum = this.getAttributeStat(Attribute.DEX) + this.getAttributeStat(Attribute.WIS);
                break;
            case AttackType.Curse:  // willpower
                statSum = this.getAttributeStat(Attribute.INT) + this.getAttributeStat(Attribute.CHAR);
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

    getCurrentFp() : number {
        return this.data.currentFp;
    }

    setCurrentFp(fp: number) {
        this.data.currentFp = fp;
    }

    getWeapons() : WeaponData[] {
        return this.data.weapons;
    }
}