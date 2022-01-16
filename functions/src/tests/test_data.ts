import { AbilityData } from 'ability';
import { AttackType, Attribute, DamageType } from 'base_game_enums';
import { CharacterData } from 'character';
import { WeaponData } from 'weapon';

export function getCharacterRepr() : CharacterData {
    const weapons: WeaponData[] = [
        {
            name: 'weapon1',
            attribute: Attribute.STR,
            attackType: AttackType.Strike,
            damageType: DamageType.Bludgeoning,
            baseDamage: 1,
            toHitMultiplier: 2,
            damageMultiplier: 3,
            difficultyClass: 4,
        },
        {
            name: 'weapon2',
            attribute: Attribute.INT,
            attackType: AttackType.Curse,
            damageType: DamageType.Necrotic,
            baseDamage: 5,
            toHitMultiplier: 6,
            damageMultiplier: 7,
            difficultyClass: 8,
        },
    ];

    const abilites: AbilityData[] = [
        {
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
        }
    ];

    return {
        name: 'nevin_pls',
        attributes: {
            CON: 1,
            STR: 2,
            DEX: 3,
            WIS: 4,
            INT: 5,
            CHAR: 6,
        },
        resistanceToFlat: {
            Slashing: 1,
            Bludgeoning: 2,
            Piercing: 3,
            Fire: 4,
            Water: 5,
            Air: 6,
            Earth: 7,
            Poison: 8,
            Radiant: 9,
            Necrotic: 10,
            Psychic: 11,
        },
        resistanceToPercent: {
            Slashing: 10,
            Bludgeoning: 20,
            Piercing: 30,
            Fire: 40,
            Water: 50,
            Air: 60,
            Earth: 70,
            Poison: 80,
            Radiant: 90,
            Necrotic: 100,
            Psychic: 110,
        },
        skills: {
            Acrobatics: 1,
            Arcana: 2,
            Athletics: 3,
            Culture: 4,
            Deception: 5,
            Endurance: 6,
            History: 7,
            Insight: 8,
            Intimidation: 9,
            Investigation: 10,
            Medicine: 11,
            Nature: 12,
            Performance: 13,
            Persuasion: 14,
            Religion: 15,
            SleightOfHand: 16,
            Stealth: 17,
            Survival: 18,
        },
        maxHp: 100,
        currentHp: 90,
        maxFp: 50,
        currentFp: 40,
        level: 1,
        initiative: 0,
        cooldowns: ' ',
        statuses: ' ',
        armor: 'Naked',
        race: 'Human',
        class: 'Bandit',
        movement: 30,
        weapons: weapons,
        abilities: abilites,
    };
}

export function getUnitRepr() : any {
    return {
        CON: 1,
        STR: 2,
        DEX: 3,
        WIS: 4,
        INT: 5,
        CHAR: 6,
        hpPerCon: 7,
        fpPerInt: 8,
        movement: 9,
    };
}