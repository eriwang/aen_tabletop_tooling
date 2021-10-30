import { AttributeStats, Character, calculateToHit, Weapon, Attribute, AttackType } from 'attack_calculator';

let attackerAttrStats: AttributeStats, attackerWeapon: Weapon, attacker: Character;
let defenderAttrStats: AttributeStats, defenderWeapon: Weapon, defender: Character;

beforeAll(() => {
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
});

describe('doesAttackHit is correct', () => {
    test('attackerToHit > defenderEvade', () => {
        const results = calculateToHit(20, attacker, defender);

        expect(results).toStrictEqual({
            doesAttackHit: true,
            attackerToHit: 1,
            defenderEvade: 0,
        });
    });

    test('attackerToHit < defenderEvade', () => {

    });

    test('attackerToHit == defenderEvade', () => {

    });
});

describe('toHit and evade calculation is correct', () => {
    test('roll changes attackerToHit', () => {

    });

    test('attacker stat changes attackerToHit', () => {

    });

    test('weapToHitMultiplier changes attackerToHit', () => {
        // - ceil calculations happen here (for now, at least)
    });

    test('weapDifficultyClass changes attackerToHit', () => {

    });

    test('defender stat changes defenderEvade', () => {
        // - ceil calculations happen here
    });
});

describe('stats used by calculation are correct', () => {
    test('weapon attribute changes attackerToHit', () => {
        // con
        // str
        // dex
        // wis
        // int
        // cha
    });

    test('weapon attacky type changes defender evade', () => {
        // strike -> fortitude
        // projectile -> reflex
        // curse -> willpower
    });
});
