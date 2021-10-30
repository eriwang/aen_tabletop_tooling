import { AttributeStats, Character, calculateToHit, Weapon, Attribute, AttackType } from 'attack_calculator';

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
        difficultyClass: 2
    };
    attacker = new Character(attackerAttrStats, attackerWeapon);

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
        difficultyClass: 2
    };
    defender = new Character(defenderAttrStats, defenderWeapon);
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

describe('stats used by calculation are correct', () => {
    test('weapon attribute changes attackerToHit', () => {
        function resetAndTestForAttribute(attribute: Attribute) {
            resetValues();
            attacker.weapon.attribute = attribute;
            attacker.attributeStats.setAttribute(attribute, 20);

            const results = calculateToHit(1, attacker, defender);
            expect(results.attackerToHit).toBe(24);  // 20 * 1.25 - 2 + 1
            expect(results.defenderEvade).toBe(22);  // ceil(0.75 * (15 + 14))
        }

        resetAndTestForAttribute(Attribute.Constitution);
        resetAndTestForAttribute(Attribute.Strength);
        resetAndTestForAttribute(Attribute.Dexterity);
        resetAndTestForAttribute(Attribute.Wisdom);
        resetAndTestForAttribute(Attribute.Intelligence);
        resetAndTestForAttribute(Attribute.Charisma);
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
