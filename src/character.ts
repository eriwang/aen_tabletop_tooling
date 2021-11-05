import { AttributeStats } from 'attribute_stats';
import { Attribute, AttackType, DamageType } from 'base_game_enums';
import { ResistanceStats } from 'resistance_stats';

// This is here for now since there's not much special about weapons (yet)
export interface Weapon {
    // Note that there can be multiple attributes here (and one multiplier per attribute), it's just not implemented yet
    attribute: Attribute;
    attackType: AttackType;
    damageType: DamageType;
    baseDamage: number;
    attributeMultiplier: number;
    difficultyClass: number;
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

    getScalingFactor() : number {
        return Math.ceil(
            this.attributeStats.get(this.weapon.attribute) *
            this.weapon.attributeMultiplier
        );
    }
}