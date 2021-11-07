import { calculateToHit, calculateDamage } from 'attack_calculator';
import { AttributeStats } from 'attribute_stats';
import { Attribute, AttackType, DamageType, Skills } from 'base_game_enums';
import { Character } from 'character';
import { Profile } from 'profile';
import { ResistanceStats } from 'resistance_stats';
import { enumerateEnumValues } from 'utils';
import { Weapon } from 'weapon';

let attacker: Character;
let defender: Character;

function resetValues() {
    // As of time of writing, profile does not impact damage calculations. This will change in the future
    const dummyProfile = new Profile({} as Record<Skills, number>, 0, 0, 0, '');

    // These are set to "identity" values (i.e. 0 for adding, 1 for multiplying) for ease of reasoning in tests
    const attackerWeapon: Weapon = {
        attribute: Attribute.Dexterity,
        attackType: AttackType.Strike,
        damageType: DamageType.Piercing,
        baseDamage: 0,
        toHitMultiplier: 1,
        damageMultiplier: 1,
        difficultyClass: 0,
    };
    attacker = new Character(AttributeStats.buildEmpty(), ResistanceStats.buildEmpty(), attackerWeapon, dummyProfile);

    const defenderWeapon: Weapon = {
        attribute: Attribute.Dexterity,
        attackType: AttackType.Strike,
        damageType: DamageType.Piercing,
        baseDamage: 0,
        toHitMultiplier: 1,
        damageMultiplier: 1,
        difficultyClass: 0,
    };
    defender = new Character(AttributeStats.buildEmpty(), ResistanceStats.buildEmpty(), defenderWeapon, dummyProfile);
}

beforeEach(resetValues);

describe('doesAttackHit is correct', () => {
    test('attackerToHit > defenderEvade', () => {
        const results = calculateToHit(15, attacker, defender);
        expect(results.doesAttackHit).toBe(true);
        expect(results.attackerToHit).toBeGreaterThan(results.defenderEvade);
    });

    // The test weapon attack type is strike, which maps to fortitude, which is calculated using str + con
    test('attackerToHit < defenderEvade', () => {
        defender.attributeStats.set(Attribute.Strength, 5);

        const results = calculateToHit(1, attacker, defender);
        expect(results.doesAttackHit).toBe(false);
        expect(results.attackerToHit).toBeLessThan(results.defenderEvade);
    });

    test('attackerToHit == defenderEvade', () => {
        defender.attributeStats.set(Attribute.Strength, 1);

        const results = calculateToHit(1, attacker, defender);
        expect(results.doesAttackHit).toBe(true);
        expect(results.attackerToHit).toBe(results.defenderEvade);
    });
});

describe('toHit and evade calculation is correct', () => {
    test('roll changes attackerToHit', () => {
        expect(calculateToHit(2, attacker, defender).attackerToHit).toBe(2);
    });

    test('attacker stat changes attackerToHit', () => {
        attacker.attributeStats.set(attacker.weapon.attribute, 12);
        expect(calculateToHit(1, attacker, defender).attackerToHit).toBe(13);  // 12 + 1
    });

    test('weapToHitMultiplier changes attackerToHit', () => {
        attacker.attributeStats.set(attacker.weapon.attribute, 12);
        attacker.weapon.toHitMultiplier = 1.4;
        expect(calculateToHit(1, attacker, defender).attackerToHit).toBe(18);  // ceil(12 * 1.4) + 1
    });

    test('weapDifficultyClass changes attackerToHit', () => {
        attacker.weapon.difficultyClass = 2;
        expect(calculateToHit(5, attacker, defender).attackerToHit).toBe(3);  // 5 - 2
    });

    test('defender stat changes defenderEvade', () => {
        defender.attributeStats.set(Attribute.Constitution, 15);
        defender.attributeStats.set(Attribute.Strength, 14);
        expect(calculateToHit(1, attacker, defender).defenderEvade).toBe(22);  // ceil(0.75 * (15 + 14))
    });
});

describe('stats used by toHit calculation are correct', () => {
    test('weapon attribute changes attackerToHit', () => {
        for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
            resetValues();
            attacker.weapon.attribute = attribute;
            attacker.attributeStats.set(attribute, 20);

            const results = calculateToHit(1, attacker, defender);
            expect(results.attackerToHit).toBe(21);  // 20 + 1
            expect(results.defenderEvade).toBe(0);  // unaffected from initial 0 value
        }
    });

    test('weapon attack type changes defender evade', () => {
        function resetAndTest(
            attackType: AttackType, attribute1: Attribute, attribute2: Attribute) {
            resetValues();

            attacker.weapon.attackType = attackType;
            defender.attributeStats.set(attribute1, 20);
            defender.attributeStats.set(attribute2, 20);

            const results = calculateToHit(1, attacker, defender);
            expect(results.attackerToHit).toBe(1);  // 0 stats + 1 for the roll
            expect(results.defenderEvade).toBe(30);  // 0.75 * (20 + 20)
        }

        resetAndTest(AttackType.Strike, Attribute.Constitution, Attribute.Strength);
        resetAndTest(AttackType.Projectile, Attribute.Dexterity, Attribute.Wisdom);
        resetAndTest(AttackType.Curse, Attribute.Intelligence, Attribute.Charisma);
    });
});

describe('damage calculation is correct', () => {
    test('weapon attribute changes damage', () => {
        for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
            resetValues();

            attacker.weapon.attribute = attribute;
            attacker.attributeStats.set(attribute, 15);

            expect(calculateDamage(attacker, defender)).toBe(15);
        }
    });

    test('weapon baseDamage changes damage', () => {
        attacker.weapon.damageType = DamageType.Piercing;
        attacker.weapon.attribute = Attribute.Charisma;
        attacker.weapon.baseDamage = 5;
        attacker.attributeStats.set(Attribute.Charisma, 15);

        expect(calculateDamage(attacker, defender)).toBe(20);  // 5 + 15 = 12
    });

    test('weapon damageMultiplier changes damage', () => {
        attacker.weapon.damageType = DamageType.Piercing;
        attacker.weapon.attribute = Attribute.Charisma;
        attacker.weapon.damageMultiplier = 1.25;
        attacker.attributeStats.set(Attribute.Charisma, 15);

        expect(calculateDamage(attacker, defender)).toBe(19);  // ceil(1.25 * 15) = 19
    });

    test('weapon damageMultiplier applied before baseDamage', () => {
        attacker.weapon.damageType = DamageType.Piercing;
        attacker.weapon.attribute = Attribute.Charisma;
        attacker.weapon.damageMultiplier = 1.25;
        attacker.weapon.baseDamage = 5;
        attacker.attributeStats.set(Attribute.Charisma, 15);

        expect(calculateDamage(attacker, defender)).toBe(24);  // ceil(1.25 * 15) + 5 = 24. ceil(1.25 * (15 + 5)) = 25
    });

    test('defender percentage res changes damage', () => {
        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            resetValues();

            attacker.weapon.damageType = damageType;
            attacker.weapon.attribute = Attribute.Charisma;
            attacker.attributeStats.set(Attribute.Charisma, 15);
            defender.resistanceStats.set(damageType, {percent: 0.25, flat: 0});

            expect(calculateDamage(attacker, defender)).toBe(12);  // ceil(15 * 0.75) = 12
        }
    });

    test('defender flat res changes damage', () => {
        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            resetValues();

            attacker.weapon.damageType = damageType;
            attacker.weapon.attribute = Attribute.Charisma;
            attacker.attributeStats.set(Attribute.Charisma, 15);
            defender.resistanceStats.set(damageType, {percent: 0, flat: 5});

            expect(calculateDamage(attacker, defender)).toBe(10);
        }
    });

    // Not sure if this is correct, but in either case there should be a test for it/ the ceil
    test('defender percent res applied before flat res', () => {
        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            resetValues();

            attacker.weapon.damageType = damageType;
            attacker.weapon.attribute = Attribute.Charisma;
            attacker.attributeStats.set(Attribute.Charisma, 15);
            defender.resistanceStats.set(damageType, {percent: 0.25, flat: 5});

            expect(calculateDamage(attacker, defender)).toBe(7);  // ceil(15 * 0.75) - 5. ceil((15 - 5) * 0.75) = 8
        }
    });

    // Not sure if this is correct, but it should be tested
    test('damage minimum is 1', () => {
        attacker.weapon.damageType = DamageType.Piercing;
        attacker.weapon.attribute = Attribute.Charisma;
        attacker.attributeStats.set(Attribute.Charisma, 15);
        defender.resistanceStats.set(DamageType.Piercing, {percent: 1, flat: 0});

        expect(calculateDamage(attacker, defender)).toBe(1);
    });
});
