import calculateAttack from 'src_firebase_functions/calculate_attack';

import * as admin from 'firebase-admin';
import fftest from 'firebase-functions-test';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';

import * as attackCalculator from 'attack_calculator';
import { getCharacterRepr } from 'tests/test_data';
import { Character } from 'character';
import { WeaponData } from 'weapon';

import { AbilityData } from 'aen_shared/src/game_data/ability';

let testCollection: admin.firestore.CollectionReference;
let testEnv: RulesTestEnvironment;

let testWeapon: WeaponData;
let testAbility: AbilityData;
let testData: any;

const calculateAttackWrapped = fftest().wrap(calculateAttack);

beforeAll(async () => {
    admin.initializeApp();
    testEnv = await initializeTestEnvironment({});
    await testEnv.clearFirestore();
    testCollection = admin.firestore().collection('Characters');
});

beforeEach(() => {
    const testAttacker = getCharacterRepr();
    const testDefender = getCharacterRepr();

    // overwrite so one has no attacks
    testDefender['weapons'] = [];
    testDefender['abilities'] = [];

    testWeapon = testAttacker['weapons'][0];
    testAbility = testAttacker['abilities'][0];
    testData = {
        attackerId: 'attacker',
        defenderId: 'defender',
        attackName: testWeapon['name'],
        roll: 5,
    };

    return Promise.all([
        testCollection.doc('attacker').set(testAttacker),
        testCollection.doc('defender').set(testDefender)
    ]);
});

afterAll(async () => {
    await testEnv.clearFirestore();
});

test('attacker does not exist', async () => {
    await testCollection.doc('attacker').delete();
    await expect(calculateAttackWrapped(testData)).rejects.toThrow('Could not find id "attacker"');
});

test('defender does not exist', async () => {
    await testCollection.doc('defender').delete();
    await expect(calculateAttackWrapped(testData)).rejects.toThrow('Could not find id "defender"');
});

test('attack name does not exist on attacker', async () => {
    const attackerNoWeapons = getCharacterRepr();
    attackerNoWeapons.weapons = [];
    await testCollection.doc('attacker').set(attackerNoWeapons);

    await expect(calculateAttackWrapped(testData)).rejects.toThrow('Could not find weapon or ability');
});

describe('calls downstream for weapon and sends correct response', () => {
    const mockCalculateToHit = jest.spyOn(attackCalculator, 'calculateToHit')
        .mockImplementation(() => { return {doesAttackHit: true, attackerToHit: 10, defenderEvade: 2}; });
    const mockCalculateDamage = jest.spyOn(attackCalculator, 'calculateDamage')
        .mockImplementation(() => 3);

    test('weapon', async () => {
        const result = await calculateAttackWrapped(testData);

        expect(mockCalculateToHit).toHaveBeenCalledWith(
            5,
            expect.any(Character),
            expect.any(Character),
            testWeapon,
        );
        expect(mockCalculateDamage).toHaveBeenCalledWith(
            expect.any(Character),
            expect.any(Character),
            testWeapon,
        );
        expect(result).toEqual({
            doesAttackHit: true,
            attackerToHit: 10,
            defenderEvade: 2,
            damage: 3,
        });
    });

    test('ability', async () => {
        testData['attackName'] = testAbility.name;
        const result = await calculateAttackWrapped(testData);

        expect(mockCalculateToHit).toHaveBeenCalledWith(
            5,
            expect.any(Character),
            expect.any(Character),
            testAbility,
        );
        expect(mockCalculateDamage).toHaveBeenCalledWith(
            expect.any(Character),
            expect.any(Character),
            testAbility,
        );
        expect(result).toEqual({
            doesAttackHit: true,
            attackerToHit: 10,
            defenderEvade: 2,
            damage: 3,
        });
    });
});
