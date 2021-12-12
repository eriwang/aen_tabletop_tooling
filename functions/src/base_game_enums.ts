// Note, the name for this file is pretty arbitrary, it could be named better
export enum Attribute {
    Constitution,
    Strength,
    Dexterity,
    Wisdom,
    Intelligence,
    Charisma,
}

export function getAbbrevFromAttr(attr: Attribute) : string {
    switch (attr) {
        case Attribute.Constitution:
            return 'CON';
        case Attribute.Strength:
            return 'STR';
        case Attribute.Dexterity:
            return 'DEX';
        case Attribute.Wisdom:
            return 'WIS';
        case Attribute.Intelligence:
            return 'INT';
        case Attribute.Charisma:
            return 'CHAR';

        default:
            throw `Unknown attribute ${attr}`;
    }
}

export function getAttrFromAbbrev(abbrev: string) : Attribute {
    switch (abbrev) {
        case 'CON':
            return Attribute.Constitution;
        case 'STR':
            return Attribute.Strength;
        case 'DEX':
            return Attribute.Dexterity;
        case 'WIS':
            return Attribute.Wisdom;
        case 'INT':
            return Attribute.Intelligence;
        case 'CHAR':
            return Attribute.Charisma;

        default:
            throw `Unknown abbrev ${abbrev}`;
    }
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

export enum DamageType {
    Slashing,
    Bludgeoning,
    Piercing,
    Fire,
    Water,
    Air,
    Earth,
    Poison,
    Radiant,
    Necrotic,
    Psychic,
}

export enum Skills {
    Endurance,
    Athletics,
    Acrobatics,
    SleightOfHand,
    Nature,
    Religion,
    Medicine,
    Stealth,
    Survival,
    Arcana,
    History,
    Investigation,
    Culture,
    Deception,
    Intimidation,
    Performance,
    Persuasion,
    Insight,
}

export enum Stats {
    HP,
    FP,
    FOR,
    REF,
    WILL,
    Movement
}
