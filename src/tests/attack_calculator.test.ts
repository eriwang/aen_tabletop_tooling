import {
    AttributeStats, Character, calculateToHit, calculateDamage, Weapon, Attribute, AttackType
} from 'attack_calculator';
import { DamageType, ResistanceStats } from 'resistance_stats';
import { enumerateEnumValues } from 'utils';

let attackerAttrStats: AttributeStats, attackerWeapon: Weapon, attacker: Character;
let defenderAttrStats: AttributeStats, defenderWeapon: Weapon, defender: Character;

function resetValues() {
    attackerAttrStats = new AttributeStats({
        con: 10, str: 11, dex: 12, wis: 13, int: 14, cha: 15,
    });
    attackerWeapon = {
        attribute: Attribute.Dexterity,
        attackType: AttackType.Strike,
        toHitMultiplier: 1.25,
        difficultyClass: 2,
        damageType: DamageType.Piercing,
    };
    attacker = new Character(attackerAttrStats, new ResistanceStats(), attackerWeapon);

    defenderAttrStats = new AttributeStats({
        con: 15,
        str: 14,
        dex: 13,
        wis: 12,
        int: 11,
        cha: 10,
    });
    defenderWeapon = {
        attribute: Attribute.Dexterity,
        attackType: AttackType.Strike,
        toHitMultiplier: 1.25,
        difficultyClass: 2,
        damageType: DamageType.Piercing,
    };
    defender = new Character(defenderAttrStats, new ResistanceStats(), defenderWeapon);
}

beforeEach(resetValues);

describe('doesAttackHit is correct', () => {
    test('attackerToHit > defenderEvade', () => {
        const results = calculateToHit(15, attacker, defender);
        expect(results.doesAttackHit).toBe(true);  // 12 * 1.25 - 2 + 15 > 0.75 * (15 + 14)
    });

    test('attackerToHit < defenderEvade', () => {
        const results = calculateToHit(1, attacker, defender);
        expect(results.doesAttackHit).toBe(false);  // 12 * 1.25 - 2 + 1 < 0.75 * (15 + 14)
    });

    test('attackerToHit == defenderEvade', () => {
        const results = calculateToHit(9, attacker, defender);
        expect(results.doesAttackHit).toBe(true);  // 12 * 1.25 - 2 + 9 == 0.75 * (15 + 14)
    });
});

describe('toHit and evade calculation is correct', () => {
    test('roll changes attackerToHit', () => {
        const resultsRoll1 = calculateToHit(1, attacker, defender);
        expect(resultsRoll1.attackerToHit).toBe(14);  // 12 * 1.25 - 2 + 1

        const resultsRoll2 = calculateToHit(2, attacker, defender);
        expect(resultsRoll2.attackerToHit).toBe(15);  // 12 * 1.25 - 2 + 2

        expect(resultsRoll1.defenderEvade).toBe(resultsRoll2.defenderEvade);
    });

    test('attacker stat changes attackerToHit', () => {
        attacker.attributeStats.setAttribute(Attribute.Dexterity, 12);
        const resultsDex12 = calculateToHit(1, attacker, defender);
        expect(resultsDex12.attackerToHit).toBe(14);  // 12 * 1.25 - 2 + 1

        attacker.attributeStats.setAttribute(Attribute.Dexterity, 16);
        const resultsDex16 = calculateToHit(1, attacker, defender);
        expect(resultsDex16.attackerToHit).toBe(19);  // 16 * 1.25 - 2 + 1

        expect(resultsDex12.defenderEvade).toBe(resultsDex16.defenderEvade);
    });

    test('weapToHitMultiplier changes attackerToHit', () => {
        attacker.weapon.toHitMultiplier = 1.25;
        const resultsMult125 = calculateToHit(1, attacker, defender);
        expect(resultsMult125.attackerToHit).toBe(14);  // 12 * 1.25 - 2 + 1

        attacker.weapon.toHitMultiplier = 1.4;
        const resultsMult14 = calculateToHit(1, attacker, defender);
        expect(resultsMult14.attackerToHit).toBe(16);  // ceil(12 * 1.4 - 2 + 1)

        expect(resultsMult125.defenderEvade).toBe(resultsMult14.defenderEvade);
    });

    test('weapDifficultyClass changes attackerToHit', () => {
        attacker.weapon.difficultyClass = 2;
        const resultsDc2 = calculateToHit(1, attacker, defender);
        expect(resultsDc2.attackerToHit).toBe(14);  // 12 * 1.25 - 2 + 1

        attacker.weapon.difficultyClass = 0;
        const resultsDc0 = calculateToHit(1, attacker, defender);
        expect(resultsDc0.attackerToHit).toBe(16);  // 12 * 1.25 - 0 + 1

        expect(resultsDc2.defenderEvade).toBe(resultsDc0.defenderEvade);
    });

    test('defender stat changes defenderEvade', () => {
        defender.attributeStats.setAttribute(Attribute.Constitution, 15);
        defender.attributeStats.setAttribute(Attribute.Strength, 14);
        const resultsCon15Str14 = calculateToHit(1, attacker, defender);
        expect(resultsCon15Str14.defenderEvade).toBe(22);  // ceil(0.75 * (15 + 14))

        defender.attributeStats.setAttribute(Attribute.Constitution, 20);
        defender.attributeStats.setAttribute(Attribute.Strength, 14);
        const resultsCon20Str14 = calculateToHit(1, attacker, defender);
        expect(resultsCon20Str14.defenderEvade).toBe(26);  // ceil(0.75 * (20 + 14))

        defender.attributeStats.setAttribute(Attribute.Constitution, 15);
        defender.attributeStats.setAttribute(Attribute.Strength, 20);
        const resultsCon15Str20 = calculateToHit(1, attacker, defender);
        expect(resultsCon15Str20.defenderEvade).toBe(27);  // ceil(0.75 * (15 + 20))

        expect(resultsCon15Str14.attackerToHit).toBe(resultsCon20Str14.attackerToHit);
        expect(resultsCon20Str14.attackerToHit).toBe(resultsCon15Str20.attackerToHit);
    });
});

describe('stats used by toHit calculation are correct', () => {
    test('weapon attribute changes attackerToHit', () => {
        function resetAndTestForAttribute(attribute: Attribute) {
            resetValues();
            attacker.weapon.attribute = attribute;
            attacker.attributeStats.setAttribute(attribute, 20);

            const results = calculateToHit(1, attacker, defender);
            expect(results.attackerToHit).toBe(24);  // 20 * 1.25 - 2 + 1
            expect(results.defenderEvade).toBe(22);  // ceil(0.75 * (15 + 14))
        }

        for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
            resetAndTestForAttribute(attribute);
        }
    });

    test('weapon attack type changes defender evade', () => {
        function resetAndTestForAttackTypeAndAttributes(
            attackType: AttackType, attribute1: Attribute, attribute2: Attribute) {
            resetValues();
            attacker.weapon.attackType = attackType;
            defender.attributeStats.setAttribute(attribute1, 20);
            defender.attributeStats.setAttribute(attribute2, 20);

            const results = calculateToHit(1, attacker, defender);
            expect(results.attackerToHit).toBe(14);  // 12 * 1.25 - 2 + 1
            expect(results.defenderEvade).toBe(30);  // 0.75 * (20 + 20)
        }

        resetAndTestForAttackTypeAndAttributes(AttackType.Strike, Attribute.Constitution, Attribute.Strength);
        resetAndTestForAttackTypeAndAttributes(AttackType.Projectile, Attribute.Dexterity, Attribute.Wisdom);
        resetAndTestForAttackTypeAndAttributes(AttackType.Curse, Attribute.Intelligence, Attribute.Charisma);
    });
});

describe('damage calculation is correct', () => {
    test('weapon attribute changes damage', () => {
        function resetAndTestForAttribute(attribute: Attribute) {
            resetValues();
            attacker.weapon.attribute = attribute;
            attacker.attributeStats.setAttribute(attribute, 15);

            expect(calculateDamage(attacker, defender)).toBe(15);
        }

        for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
            resetAndTestForAttribute(attribute);
        }
    });

    test('defender percentage res changes damage', () => {
        function resetAndTestForPercentRes(damageType: DamageType) {
            resetValues();
            attacker.weapon.damageType = damageType;
            attacker.weapon.attribute = Attribute.Charisma;
            attacker.attributeStats.setAttribute(Attribute.Charisma, 15);

            defender.resistanceStats.set(damageType, {percent: 0.25, flat: 0});

            expect(calculateDamage(attacker, defender)).toBe(12);  // ceil(15 * 0.75) = 12
        }

        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            resetAndTestForPercentRes(damageType);
        }
    });

    test('defender flat res changes damage', () => {
        function resetAndTestForPercentRes(damageType: DamageType) {
            resetValues();
            attacker.weapon.damageType = damageType;
            attacker.weapon.attribute = Attribute.Charisma;
            attacker.attributeStats.setAttribute(Attribute.Charisma, 15);

            defender.resistanceStats.set(damageType, {percent: 0, flat: 5});

            expect(calculateDamage(attacker, defender)).toBe(10);
        }

        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            resetAndTestForPercentRes(damageType);
        }
    });

    // Not sure if this is correct, but in either case there should be a test for it/ the ceil
    test('defender percent res applied before flat res', () => {
        function resetAndTestForPercentRes(damageType: DamageType) {
            resetValues();
            attacker.weapon.damageType = damageType;
            attacker.weapon.attribute = Attribute.Charisma;
            attacker.attributeStats.setAttribute(Attribute.Charisma, 15);

            defender.resistanceStats.set(damageType, {percent: 0.25, flat: 5});

            expect(calculateDamage(attacker, defender)).toBe(7);  // ceil(15 * 0.75) - 5. ceil((15 - 5) * 0.75) = 8
        }

        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            resetAndTestForPercentRes(damageType);
        }
    });

    // Not sure if this is correct, but it should be tested
    test('damage minimum is 1', () => {
        attacker.weapon.damageType = DamageType.Piercing;
        attacker.weapon.attribute = Attribute.Charisma;
        attacker.attributeStats.setAttribute(Attribute.Charisma, 15);

        defender.resistanceStats.set(DamageType.Piercing, {percent: 1, flat: 0});

        expect(calculateDamage(attacker, defender)).toBe(1);
    });
});
