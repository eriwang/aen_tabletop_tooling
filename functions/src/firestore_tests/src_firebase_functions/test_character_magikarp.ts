import { AbilityData } from 'ability';
import { ArmorData } from 'armor';
import { AttackType, Attribute, DamageType } from 'base_game_enums';
import { ClassData } from 'class';
import { ProfileData } from 'profile';
import { RaceData } from 'race';
import { WeaponData } from 'weapon';
import { CharacterData } from 'character';

export const flail : WeaponData = {
    name: 'flail',
    attribute: Attribute.STR,
    attackType: AttackType.Strike,
    damageType: DamageType.Bludgeoning,
    baseDamage: 1,
    toHitMultiplier: 2,
    damageMultiplier: 3,
    difficultyClass: 4,
};

export const splash: AbilityData = {
    name: 'Splash',
    category: 'Basic',
    cooldown: 0,
    description: 'Splash failed',
    fpCost: 10,
    isAttack: true,
    attribute: 'STR',
    baseDamage: 0,
    damageMultiplier: 0,
    hitDC: 1000,
    range: 5,
    attackType: 'Strike',
    damageType: 'Bludgeoning',
};

export const water: ArmorData = {
    name: 'Water',
    resistanceToFlat: {
        Slashing: 0,
        Bludgeoning: 0,
        Piercing: 0,
        Fire: 100,
        Water: 100,
        Air: -100,
        Earth: 0,
        Poison: 0,
        Radiant: 0,
        Necrotic: 0,
        Psychic: 0,
    },
    resistanceToPercent: {
        Slashing: 0,
        Bludgeoning: 0,
        Piercing: 0,
        Fire: 50,
        Water: 50,
        Air: -50,
        Earth: 0,
        Poison: 0,
        Radiant: 0,
        Necrotic: 0,
        Psychic: 0,
    },
};

export const fish : RaceData = {
    movement: 80
};

export const pokemon : ClassData = {
    hpPerCon: 1,
    fpPerInt: 1,
};

export const karp : ProfileData = {
    abilities: ['Splash'],
    attributeBonuses: {
        CON: 125,
        STR: 21,
        DEX: 75,
        WIS: 33,
        INT: 27,
        CHAR: 1,
    },
    baseAttributes: {
        CON: 20,
        STR: 10,
        DEX: 55,
        WIS: 20,
        INT: 15,
        CHAR: 100,
    },
    skillProficiency: {
        Acrobatics: 1,
        Athletics: 1,
        Endurance: 1,
        Intimidation: -1,
        Nature: 1,
        Performance: 1,
        Survival: -1,

        Arcana: 0,
        Culture: 0,
        Deception: 0,
        History: 0,
        Insight: 0,
        Investigation: 0,
        Medicine: 0,
        Persuasion: 0,
        Religion: 0,
        SleightOfHand: 0,
        Stealth: 0,
    },
    armor: 'Water',
    level: 100,
    race: 'Fish',
    class: 'Pokemon',
    weapons: ['Flail'],
};

export const magikarp : CharacterData = {
    name: 'Magikarp',
    attributes: {
        CON: 244,
        STR: 130,
        DEX: 229,
        WIS: 152,
        INT: 141,
        CHAR: 200,
    },
    resistanceToFlat: {
        Slashing: 0,
        Bludgeoning: 0,
        Piercing: 0,
        Fire: 100,
        Water: 100,
        Air: -100,
        Earth: 0,
        Poison: 0,
        Radiant: 0,
        Necrotic: 0,
        Psychic: 0,
    },
    resistanceToPercent: {
        Slashing: 0,
        Bludgeoning: 0,
        Piercing: 0,
        Fire: 50,
        Water: 50,
        Air: -50,
        Earth: 0,
        Poison: 0,
        Radiant: 0,
        Necrotic: 0,
        Psychic: 0,
    },
    skills: {
        Acrobatics: 233,
        Arcana: 141,
        Athletics: 134,
        Culture: 141,
        Deception: 200,
        Endurance: 248,
        History: 141,
        Insight: 200,
        Intimidation: 196,
        Investigation: 141,
        Medicine: 152,
        Nature: 156,
        Performance: 204,
        Persuasion: 200,
        Religion: 152,
        SleightOfHand: 229,
        Stealth: 152,
        Survival: 148,
    },
    maxHp: 244,
    currentHp: 244,
    maxFp: 141,
    currentFp: 141,
    level: 100,
    initiative: 0,
    cooldowns: ' ',
    statuses: ' ',
    armor: 'Water',
    race: 'Fish',
    class: 'Pokemon',
    movement: 80,
    weapons: [flail],
    abilities: [splash],

};