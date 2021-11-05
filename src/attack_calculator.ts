import { AttackType, EvasiveStatType } from 'base_game_enums';
import { Character } from 'character';

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
export function calculateToHit(roll: number, attacker: Character, defender: Character) : ToHitResults {
    // Note that some of these (and in calculateDamage) could probably go on the Character class instead, and might
    // make the testing story a tad cleaner
    const attackerToHit = attacker.getScalingFactor() - attacker.weapon.difficultyClass + roll;
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
    const attackerDamage = attacker.getScalingFactor() + attacker.weapon.baseDamage;
    const defenderRes = defender.resistanceStats.get(attacker.weapon.damageType);
    const calcDmg = Math.ceil(attackerDamage * (1 - defenderRes.percent)) - defenderRes.flat;
    return Math.max(calcDmg, 1);
}
