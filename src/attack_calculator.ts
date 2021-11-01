import { AttackType, EvasiveStatType } from 'base_game_enums';
import { Character } from 'character';

// Note that these enums/ util classes should likely be moved elsewhere eventually
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
