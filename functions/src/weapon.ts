import { AttackType, Attribute, DamageType } from 'base_game_enums';

export interface Weapon {
    name: string;
    attribute: Attribute;
    attackType: AttackType;
    damageType: DamageType;
    baseDamage: number;
    toHitMultiplier: number;
    damageMultiplier: number;
    difficultyClass: number;
}
