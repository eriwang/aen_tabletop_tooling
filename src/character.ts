import { AttributeStats } from 'attribute_stats';
import { Attribute, AttackType, DamageType } from 'base_game_enums';
import { ResistanceStats } from 'resistance_stats';

// This is here for now since there's not much special about weapons (yet)
export interface Weapon {
    attribute: Attribute;
    attackType: AttackType;
    toHitMultiplier: number;
    difficultyClass: number;
    damageType: DamageType;
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