import { Attack, calculateToHit, calculateDamage } from 'attack_calculator';
import { Attribute, AttackType, DamageType } from 'base_game_enums';
import { Character } from 'character';
import { enumerateEnumValues } from 'utils';

import { when } from 'jest-when';

let attack: Attack;
let attacker: Character;
let defender: Character;

function resetValues() {
    attack = {
        attribute: Attribute.Dexterity,
        attackType: AttackType.Strike,
        damageType: DamageType.Piercing,
        baseDamage: 0,
        toHitMultiplier: 1,
        damageMultiplier: 1,
        difficultyClass: 0,
    };

    attacker = {
        getAttributeStat: jest.fn(),
        weapon: attack
    } as any as Character;

    defender = {
        getResistanceStat: jest.fn(),
        getEvasiveStatForAttackType: jest.fn(),
    } as any as Character;

    // These are set to "identity" values (i.e. 0 for adding, 1 for multiplying) for ease of reasoning in tests
    enumerateEnumValues<Attribute>(Attribute).map((attr) => {
        when(attacker.getAttributeStat).calledWith(attr).mockReturnValue(0);
    });

    enumerateEnumValues<DamageType>(DamageType).map((dmgType) => {
        when(defender.getResistanceStat).calledWith(dmgType).mockReturnValue({flat: 0, percent: 0});
    });

    enumerateEnumValues<AttackType>(AttackType).map((atkType) => {
        when(defender.getEvasiveStatForAttackType).calledWith(atkType).mockReturnValue(0);
    });
}

beforeEach(resetValues);

describe('doesAttackHit is correct', () => {
    test('attackerToHit > defenderEvade', () => {
        const results = calculateToHit(15, attacker, defender, attack);
        expect(results.doesAttackHit).toBe(true);
        expect(results.attackerToHit).toBeGreaterThan(results.defenderEvade);
    });

    test('attackerToHit < defenderEvade', () => {
        when(defender.getEvasiveStatForAttackType).calledWith(attack.attackType).mockReturnValue(5);

        const results = calculateToHit(1, attacker, defender, attack);
        expect(results.doesAttackHit).toBe(false);
        expect(results.attackerToHit).toBeLessThan(results.defenderEvade);
    });

    test('attackerToHit == defenderEvade', () => {
        when(defender.getEvasiveStatForAttackType).calledWith(attack.attackType).mockReturnValue(1);

        const results = calculateToHit(1, attacker, defender, attack);
        expect(results.doesAttackHit).toBe(true);
        expect(results.attackerToHit).toBe(results.defenderEvade);
    });
});

describe('toHit and evade calculation is correct', () => {
    test('roll changes attackerToHit', () => {
        expect(calculateToHit(2, attacker, defender, attack).attackerToHit).toBe(2);
    });

    test('attacker stat changes attackerToHit', () => {
        when(attacker.getAttributeStat).calledWith(attack.attribute).mockReturnValue(12);
        expect(calculateToHit(1, attacker, defender, attack).attackerToHit).toBe(13);  // 12 + 1
    });

    test('weapToHitMultiplier changes attackerToHit', () => {
        when(attacker.getAttributeStat).calledWith(attack.attribute).mockReturnValue(12);
        attack.toHitMultiplier = 1.4;
        expect(calculateToHit(1, attacker, defender, attack).attackerToHit).toBe(18);  // ceil(12 * 1.4) + 1
    });

    test('weapDifficultyClass changes attackerToHit', () => {
        attack.difficultyClass = 2;
        expect(calculateToHit(5, attacker, defender, attack).attackerToHit).toBe(3);  // 5 - 2
    });

    test('defender stat changes defenderEvade', () => {
        when(defender.getEvasiveStatForAttackType).calledWith(attack.attackType).mockReturnValue(22);
        expect(calculateToHit(1, attacker, defender, attack).defenderEvade).toBe(22);
    });
});

describe('damage calculation is correct', () => {
    test('weapon baseDamage changes damage', () => {
        attack.baseDamage = 5;
        expect(calculateDamage(attacker, defender, attack)).toBe(5);
    });

    test('weapon damageMultiplier changes damage', () => {
        attack.damageMultiplier = 1.25;
        when(attacker.getAttributeStat).calledWith(attack.attribute).mockReturnValue(15);

        expect(calculateDamage(attacker, defender, attack)).toBe(19);  // ceil(1.25 * 15) = 19
    });

    test('weapon damageMultiplier applied before baseDamage', () => {
        attack.baseDamage = 5;
        attack.damageMultiplier = 1.25;
        when(attacker.getAttributeStat).calledWith(attack.attribute).mockReturnValue(15);

        // ceil(1.25 * 15) + 5 = 24. ceil(1.25 * (15 + 5)) = 25
        expect(calculateDamage(attacker, defender, attack)).toBe(24);
    });

    test('defender percentage res changes damage', () => {
        when(defender.getResistanceStat).calledWith(attack.damageType)
            .mockReturnValue({percent: 0.25, flat: 0});
        when(attacker.getAttributeStat).calledWith(attack.attribute).mockReturnValue(15);

        expect(calculateDamage(attacker, defender, attack)).toBe(12);  // ceil(15 * 0.75) = 12
    });

    test('defender flat res changes damage', () => {
        when(defender.getResistanceStat).calledWith(attack.damageType)
            .mockReturnValue({percent: 0, flat: 5});
        when(attacker.getAttributeStat).calledWith(attack.attribute).mockReturnValue(15);

        expect(calculateDamage(attacker, defender, attack)).toBe(10);
    });

    // Not sure if this is correct, but in either case there should be a test for it/ the ceil
    test('defender percent res applied before flat res', () => {
        when(defender.getResistanceStat).calledWith(attack.damageType)
            .mockReturnValue({percent: 0.25, flat: 5});
        when(attacker.getAttributeStat).calledWith(attack.attribute).mockReturnValue(15);

        expect(calculateDamage(attacker, defender, attack)).toBe(7);  // ceil(15 * 0.75) - 5. ceil((15 - 5) * 0.75) = 8
    });

    // Not sure if this is correct, but it should be tested
    test('damage minimum is 1', () => {
        when(defender.getResistanceStat).calledWith(attack.damageType)
            .mockReturnValue({percent: 1, flat: 0});
        when(attacker.getAttributeStat).calledWith(attack.attribute).mockReturnValue(15);

        expect(calculateDamage(attacker, defender, attack)).toBe(1);
    });
});
