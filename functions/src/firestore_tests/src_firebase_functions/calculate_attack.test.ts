import calculateAttack from 'src_firebase_functions/calculate_attack';

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';

import { getTestCharacterFirestoreRepr } from 'firestore_tests/utils';

let testCollection: admin.firestore.CollectionReference;
let testEnv: RulesTestEnvironment;
let testRequest: functions.https.Request;
const testResponse = { send: jest.fn() } as any as functions.Response;

beforeAll(async () => {
    admin.initializeApp();
    testEnv = await initializeTestEnvironment({});
    await testEnv.clearFirestore();
    testCollection = admin.firestore().collection('character');
});

beforeEach(() => {
    const testAttacker = getTestCharacterFirestoreRepr();
    const testDefender = getTestCharacterFirestoreRepr();
    testDefender['weapons'] = [];  // overwrite to make attacker/defender different

    testRequest = {
        query: {
            attackerId: 'attacker',
            defenderId: 'defender',
            weaponName: testAttacker['weapons'][0]['name'],
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
    expect(await calculateAttack(testRequest, testResponse)).toThrowError();
});

test('defender does not exist', async () => {
    await testCollection.doc('defender').delete();
    expect(() => calculateAttack(testRequest, testResponse)).toThrowError();
});

test('weaponId does not exist on attacker', () => {
    testRequest['query']['attackerId'] = 'defender';
    expect(() => calculateAttack(testRequest, testResponse)).toThrowError();
});

test('calls downstream correctly', () => {

});

test('sends correct response', () => {

});