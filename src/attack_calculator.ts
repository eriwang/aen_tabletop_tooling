import { DamageType, ResistanceStats } from 'resistance_stats';

// Note that these enums/ util classes should likely be moved elsewhere eventually
export enum Attribute {
    Constitution,
    Strength,
    Dexterity,
    Wisdom,
    Intelligence,
    Charisma,
}

export enum AttackType {
    Strike,
    Projectile,
    Curse,
}

export enum EvasiveStatType {
    Fortitude,
    Reflex,
    Willpower,
}

export interface Weapon {
    attribute: Attribute;
    attackType: AttackType;
    toHitMultiplier: number;
    difficultyClass: number;
    damageType: DamageType;
}

// TODO: does Record<Attribute, number> work, then get rid of this class?
export class AttributeStats {
    constitution: number;
    strength: number;
    dexterity: number;
    wisdom: number;
    intelligence: number;
    charisma: number;

    constructor({con, str, dex, wis, int, cha} : {
        con: number, str: number, dex: number, wis: number, int: number, cha: number
    }) {
        this.constitution = con;
        this.strength = str;
        this.dexterity = dex;
        this.wisdom = wis;
        this.intelligence = int;
        this.charisma = cha;
    }

    getAttribute(attribute: Attribute) : number {
        switch (attribute) {
            case Attribute.Constitution:
                return this.constitution;
            case Attribute.Strength:
                return this.strength;
            case Attribute.Dexterity:
                return this.dexterity;
            case Attribute.Wisdom:
                return this.wisdom;
            case Attribute.Intelligence:
                return this.intelligence;
            case Attribute.Charisma:
                return this.charisma;

            default:
                throw `Unknown attribute ${attribute}`;
        }
    }

    setAttribute(attribute: Attribute, value: number) {
        switch (attribute) {
            case Attribute.Constitution:
                this.constitution = value;
                break;
            case Attribute.Strength:
                this.strength = value;
                break;
            case Attribute.Dexterity:
                this.dexterity = value;
                break;
            case Attribute.Wisdom:
                this.wisdom = value;
                break;
            case Attribute.Intelligence:
                this.intelligence = value;
                break;
            case Attribute.Charisma:
                this.charisma = value;
                break;

            default:
                throw `Unknown attribute ${attribute}`;
        }
    }

    getEvasiveStat(evasiveStatType: EvasiveStatType) : number {
        let statSum: number;
        switch (evasiveStatType) {
            case EvasiveStatType.Fortitude:
                statSum = this.constitution + this.strength;
                break;
            case EvasiveStatType.Reflex:
                statSum = this.dexterity + this.wisdom;
                break;
            case EvasiveStatType.Willpower:
                statSum = this.intelligence + this.charisma;
                break;

            default:
                throw `Unknown evasiveStatType ${evasiveStatType}`;
        }

        return Math.ceil(0.75 * statSum);
    }
}

export class Character {
    attributeStats: AttributeStats;
    resistanceStats: ResistanceStats;
    weapon: Weapon;

    constructor(attrStats: AttributeStats, resStats: ResistanceStats, weap: Weapon) {
        this.attributeStats = attrStats;
        this.resistanceStats = resStats;
        this.weapon = weap;
    }
}

interface ToHitResults {
    doesAttackHit: boolean;
    attackerToHit: number;
    defenderEvade: number;
}

function getEvasiveStatTypeForAttackType(attackType: AttackType) : EvasiveStatType {
    switch (attackType) {
        case AttackType.Strike:
            return EvasiveStatType.Fortitude;
        case AttackType.Projectile:
            return EvasiveStatType.Reflex;
        case AttackType.Curse:
            return EvasiveStatType.Willpower;

        default:
            throw `Unknown attackType ${attackType}`;
    }
}

/*
Not yet implemented for toHit:

- Crits should add 10 to attackerToHit
- Eventually probs some passives that modify to hit in certain situations, both for attacker/defender(s)
- Dual wield - toHit
 */
export function calculateToHit(roll: number, attacker: Character, defender: Character) : ToHitResults {
    const attackerWeaponAttributeToHit = Math.ceil(
        attacker.attributeStats.getAttribute(attacker.weapon.attribute) *
        attacker.weapon.toHitMultiplier
    );
    const attackerToHit = attackerWeaponAttributeToHit - attacker.weapon.difficultyClass + roll;

    const defenderEvasiveStatType = getEvasiveStatTypeForAttackType(attacker.weapon.attackType);
    const defenderEvade = defender.attributeStats.getEvasiveStat(defenderEvasiveStatType);

    return {
        doesAttackHit: attackerToHit >= defenderEvade,
        attackerToHit: attackerToHit,
        defenderEvade: defenderEvade
    };
}

/*
Not yet implemented for damage:

- Crits do extra 50% damage
- Two handing weapon multiplier
*/
export function calculateDamage(attacker: Character, defender: Character) : number {
    const atkWeapStat = attacker.attributeStats.getAttribute(attacker.weapon.attribute);
    const defAttrRes = defender.resistanceStats.get(attacker.weapon.damageType);
    const calcDmg = Math.ceil(atkWeapStat * (1 - defAttrRes.percent)) - defAttrRes.flat;
    return Math.max(calcDmg, 1);
}