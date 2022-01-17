import calculateAttack from 'src_firebase_functions/calculate_attack';

import * as admin from 'firebase-admin';
import test from 'firebase-functions-test';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';

import * as attackCalculator from 'attack_calculator';
import { getCharacterRepr } from 'tests/test_data';
import { Character } from 'character';
import { WeaponData } from 'weapon';

let testCollection: admin.firestore.CollectionReference;
let testEnv: RulesTestEnvironment;

let testWeapon: WeaponData;
let testData: {
    [key: string]: string | number,
};

const wrapped = test().wrap(calculateAttack);

beforeAll(async () => {
    admin.initializeApp();
    testEnv = await initializeTestEnvironment({});
    await testEnv.clearFirestore();
    testCollection = admin.firestore().collection('character');
});

beforeEach(() => {
    const testAttacker = getCharacterRepr();
    const testDefender = getCharacterRepr();
    testDefender['weapons'] = [];  // overwrite so one has no weapons

    testWeapon = testAttacker['weapons'][0];
    testData = {
        attackerId: 'attacker',
        defenderId: 'defender',
        weaponName: testWeapon['name'],
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

it('attacker does not exist', async () => {
    await testCollection.doc('attacker').delete();
    await expect(wrapped(testData)).rejects.toMatch('Could not find attacker');
});

it('defender does not exist', async () => {
    await testCollection.doc('defender').delete();
    await expect(wrapped(testData)).rejects.toMatch('Could not find defender');
});

it('weaponId does not exist on attacker', async () => {
    testData.attackerId = 'defender';
    await expect(wrapped(testData)).rejects.toMatch('Could not find weapon');
});

it('calls downstream and sends correct response', async () => {
    const mockCalculateToHit = jest.spyOn(attackCalculator, 'calculateToHit')
        .mockImplementation(() => { return {doesAttackHit: true, attackerToHit: 10, defenderEvade: 2}; });
    const mockCalculateDamage = jest.spyOn(attackCalculator, 'calculateDamage')
        .mockImplementation(() => 3);

    const result = await wrapped(testData);

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