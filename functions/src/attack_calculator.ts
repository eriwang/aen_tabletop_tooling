import { AbilityData } from 'ability';
import { Character } from 'character';
import { WeaponData } from 'weapon';

import { hello } from 'aen_shared';

interface ToHitResults {
    doesAttackHit: boolean;
    attackerToHit: number;
    defenderEvade: number;
}

/*
Not yet implemented for toHit:

- Crits should add 10 to attackerToHit
- Eventually probs some passives that modify to hit in certain situations, both for attacker/defender(s)
- Dual wield - toHit
 */
export function calculateToHit(roll: number, attacker: Character, defender: Character, attack: WeaponData | AbilityData)
    : ToHitResults {
    hello();
    const attackerToHitScalingFactor = Math.ceil(
        attacker.getAttributeStat(attack.attribute) *
        attack.toHitMultiplier
    );
    const attackerToHit = attackerToHitScalingFactor - attack.hitDC + roll;
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
export function calculateDamage(attacker: Character, defender: Character, attack: WeaponData | AbilityData) : number {
    const attackerDamageScalingFactor = Math.ceil(
        attacker.getAttributeStat(attack.attribute) *
        attack.damageMultiplier
    );
    const attackerDamage = attackerDamageScalingFactor + attack.baseDamage;
    const defenderRes = defender.getResistanceStat(attack.damageType);
    const calcDmg = Math.ceil(attackerDamage * (1 - defenderRes.percent)) - defenderRes.flat;
    return Math.max(calcDmg, 1);
}
