import { Attribute, AttackType, DamageType, } from 'base_game_enums';
import { Character } from 'character';

interface ToHitResults {
    doesAttackHit: boolean;
    attackerToHit: number;
    defenderEvade: number;
}

export interface Attack {
    attribute: Attribute;
    attackType: AttackType;
    damageType: DamageType;
    baseDamage: number;
    toHitMultiplier: number;
    damageMultiplier: number;
    difficultyClass: number;
}

/*
Not yet implemented for toHit:

- Crits should add 10 to attackerToHit
- Eventually probs some passives that modify to hit in certain situations, both for attacker/defender(s)
- Dual wield - toHit
 */
export function calculateToHit(roll: number, attacker: Character, defender: Character, attack: Attack) : ToHitResults {
    const attackerToHitScalingFactor = Math.ceil(
        attacker.getAttributeStat(attack.attribute) *
        attack.toHitMultiplier
    );
    const attackerToHit = attackerToHitScalingFactor - attack.difficultyClass + roll;
    const defenderEvade = defender.getEvasiveStatForAttackType(attack.attackType);

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
export function calculateDamage(attacker: Character, defender: Character, attack: Attack) : number {
    const attackerDamageScalingFactor = Math.ceil(
        attacker.getAttributeStat(attack.attribute) *
        attack.damageMultiplier
    );
    const attackerDamage = attackerDamageScalingFactor + attack.baseDamage;
    const defenderRes = defender.getResistanceStat(attack.damageType);
    const calcDmg = Math.ceil(attackerDamage * (1 - defenderRes.percent)) - defenderRes.flat;
    return Math.max(calcDmg, 1);
}
