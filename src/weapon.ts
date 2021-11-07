import { Attribute, AttackType, DamageType } from 'base_game_enums';

export interface Weapon {
    attribute: Attribute;
    attackType: AttackType;
    damageType: DamageType;
    baseDamage: number;
    toHitMultiplier: number;
    damageMultiplier: number;
    difficultyClass: number;
}