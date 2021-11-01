import { Attribute, AttackType, EvasiveStatType, DamageType } from 'base_game_enums';
import { ResistanceStats } from 'resistance_stats';

// Note that these enums/ util classes should likely be moved elsewhere eventually
export interface Weapon {
    attribute: Attribute;
    attackType: AttackType;
    toHitMultiplier: number;
    difficultyClass: number;
    damageType: DamageType;
}

export class AttributeStats {
    attributeToStat: Record<Attribute, number>;

    constructor({con, str, dex, wis, int, cha} : {
        con: number, str: number, dex: number, wis: number, int: number, cha: number
    }) {
        this.attributeToStat = {
            [Attribute.Constitution]: con,
            [Attribute.Strength]: str,
            [Attribute.Dexterity]: dex,
            [Attribute.Wisdom]: wis,
            [Attribute.Intelligence]: int,
            [Attribute.Charisma]: cha,
        };
    }

    get(attribute: Attribute) : number {
        return this.attributeToStat[attribute];
    }

    set(attribute: Attribute, value: number) {
        this.attributeToStat[attribute] = value;
    }

    getEvasiveStat(evasiveStatType: EvasiveStatType) : number {
        let statSum: number;
        switch (evasiveStatType) {
            case EvasiveStatType.Fortitude:
                statSum = this.get(Attribute.Constitution) + this.get(Attribute.Strength);
                break;
            case EvasiveStatType.Reflex:
                statSum = this.get(Attribute.Dexterity) + this.get(Attribute.Wisdom);
                break;
            case EvasiveStatType.Willpower:
                statSum = this.get(Attribute.Intelligence) + this.get(Attribute.Charisma);
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
        attacker.attributeStats.get(attacker.weapon.attribute) *
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
    const atkWeapStat = attacker.attributeStats.get(attacker.weapon.attribute);
    const defAttrRes = defender.resistanceStats.get(attacker.weapon.damageType);
    const calcDmg = Math.ceil(atkWeapStat * (1 - defAttrRes.percent)) - defAttrRes.flat;
    return Math.max(calcDmg, 1);
}
