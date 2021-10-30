import { AttributeStats, Character, calculateToHit, Weapon, Attribute, AttackType } from 'attack_calculator';

describe('doesAttackHit is correct', () => {
    /*
    - when attackerToHit > defenderEvade, doesAttackHit is true
    - when attackerToHit == defenderEvade, doesAttackHit is true
    - when attackerToHit < defenderEvade, doesAttackHit is false
    */
});

describe('toHit and evade calculation is correct', () => {
    /*
    - change roll, change attackerToHit
    - change attacker char stat, change attackerToHit
    - change weapToHitMultiplier, change attackerToHit
        - ceil calculations happen here (for now, at least)
    - change weapHitDifficultyClass, change attackerToHit
    - change defender char stat, change defenderEvade
        - ceil calculations happen here (probs forever...?)
    */
});

describe('stats used by calculation are correct', () => {
    /*
    - When weapon attribute changes, the stat used to calc attackerToHit changes
    - When weapon attackType changes, the stat used to calc defenderEvade changes
    */
});

describe('Does this even build', () => {
    test('Some random numbers', () => {
        const attackerAttrStats = new AttributeStats({
            constitution: 10,
            strength: 10,
            dexterity: 10,
            wisdom: 10,
            intelligence: 10,
            charisma: 10,
        });
        const attackerWeapon: Weapon = {
            attribute: Attribute.Dexterity,
            attackType: AttackType.Strike,
            toHitMultiplier: 1.25,
            difficultyClass: 2
        };
        const attacker = new Character(attackerAttrStats, attackerWeapon);

        const defenderAttrStats = new AttributeStats({
            constitution: 10,
            strength: 10,
            dexterity: 10,
            wisdom: 10,
            intelligence: 10,
            charisma: 10,
        });
        const defenderWeapon: Weapon = {
            attribute: Attribute.Dexterity,
            attackType: AttackType.Strike,
            toHitMultiplier: 1.25,
            difficultyClass: 2
        };
        const defender = new Character(defenderAttrStats, defenderWeapon);

        const results = calculateToHit(20, attacker, defender);

        expect(results).toStrictEqual({
            doesAttackHit: true,
            attackerToHit: 1,
            defenderEvade: 0,
        });
    });
});