import { AttackType, Attribute, DamageType } from 'base_game_enums';
import { CharacterData } from 'character';
import { WeaponData } from 'weapon';

export function getCharacterRepr() : CharacterData {
    const weapons: WeaponData[] = [
        {
            name: 'weapon1',
            attribute: Attribute.Strength,
            attackType: AttackType.Strike,
            damageType: DamageType.Bludgeoning,
            baseDamage: 1,
            toHitMultiplier: 2,
            damageMultiplier: 3,
            difficultyClass: 4,
        },
        {
            name: 'weapon2',
            attribute: Attribute.Intelligence,
            attackType: AttackType.Curse,
            damageType: DamageType.Necrotic,
            baseDamage: 5,
            toHitMultiplier: 6,
            damageMultiplier: 7,
            difficultyClass: 8,
        },
    ];

    return {
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
        maxHp: 100,
        currentHp: 90,
        weapons: weapons,
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