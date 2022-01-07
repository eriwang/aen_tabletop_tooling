import calculateAttack from 'src_firebase_functions/calculate_attack';

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';

import * as attackCalculator from 'attack_calculator';
import { getCharacterRepr } from 'firestore_tests/firestore_repr';
import { Character } from 'character';
import { Weapon } from 'weapon';

let testCollection: admin.firestore.CollectionReference;
let testEnv: RulesTestEnvironment;

let testWeapon: Weapon;
let testRequest: functions.https.Request;
const testResponse = { send: jest.fn() } as any as functions.Response;

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
    testRequest = {
        query: {
            attackerId: 'attacker',
            defenderId: 'defender',
            weaponName: testWeapon['name'],
            roll: 5,
        }
    } as any as functions.https.Request;

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
    await expect(calculateAttack(testRequest, testResponse)).rejects.toMatch('Could not find attacker');
});

test('defender does not exist', async () => {
    await testCollection.doc('defender').delete();
    await expect(calculateAttack(testRequest, testResponse)).rejects.toMatch('Could not find defender');
});

test('weaponId does not exist on attacker', async () => {
    testRequest['query']['attackerId'] = 'defender';
    await expect(calculateAttack(testRequest, testResponse)).rejects.toMatch('Could not find weapon');
});

test('calls downstream and sends correct response', async () => {
    const mockCalculateToHit = jest.spyOn(attackCalculator, 'calculateToHit')
        .mockImplementation(() => { return {doesAttackHit: true, attackerToHit: 10, defenderEvade: 2}; });
    const mockCalculateDamage = jest.spyOn(attackCalculator, 'calculateDamage')
        .mockImplementation(() => 3);

    await calculateAttack(testRequest, testResponse);

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
    expect(testResponse.send).toHaveBeenCalledWith({
        doesAttackHit: true,
        attackerToHit: 10,
        defenderEvade: 2,
        damage: 3,
    });
});