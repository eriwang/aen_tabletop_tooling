import { AttributeStats, Character, calculateToHit, Weapon, Attribute, AttackType } from 'attack_calculator';

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