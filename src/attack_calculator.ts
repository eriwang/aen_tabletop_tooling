/*

How do I calculate to hit?

- roll (1d20)
- weaponToHit = someCharStat * weapToHitMultiplier - weapHitDifficultyClass
- attackerToHit = roll + weaponToHit
- defenderEvade = charFortitude or charReflex or charWillpower
- if attackerToHit >= defenderEvade

What information do I need to calculate this?

- roll
- attacker stats:
    - character attribute stats (value of CON, STR, DEX, WIS, INT, CHA)
    - weapon primary attribute (enum of attribute))
    - weapon to hit multiplier (self-explanatory, can be 1)
    - weapon difficulty class
    - weapon attack type (enum of strike, projectile, curse)
- defender stats:
    - character attribute stats (value of CON, STR, DEX, WIS, INT, CHA)

What would be nice to output?

- Did it hit or not (duh)
- Final attacker total stat
- Defender stat

What's out of scope for v1?

- Crits will add 10 to attackerToHit
- Eventually probs some passives that modify to hit in certain situations, both for attacker/defender(s)

 */

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
}

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
}

export class Character {
    attributeStats: AttributeStats;
    weapon: Weapon;

    constructor(attrStats: AttributeStats, weap: Weapon) {
        this.attributeStats = attrStats;
        this.weapon = weap;
    }
}

interface ToHitResults {
    doesAttackHit: boolean;
    attackerToHit: number;
    defenderEvade: number;
}

export function calculateToHit(roll: number, attacker: Character, defender: Character) : ToHitResults {
    return {
        doesAttackHit: true,
        attackerToHit: 1,
        defenderEvade: 0
    };
}
