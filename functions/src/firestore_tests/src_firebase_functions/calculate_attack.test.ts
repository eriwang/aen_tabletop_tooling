import calculateAttack from 'src_firebase_functions/calculate_attack';

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { getTestCharacterFirestoreRepr } from 'firestore_tests/utils';

let testCollection: admin.firestore.CollectionReference;
let testRequest: functions.https.Request;
const testResponse = { send: jest.fn() } as any as functions.Response;

beforeAll(() => {
    admin.initializeApp();

    // Generate a random collection name to avoid interfering with other tests
    const randomCollectionName = Math.random().toString(36).slice(2);
    testCollection = admin.firestore().collection(randomCollectionName);
});

beforeEach(async () => {
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

    await Promise.all([
        testCollection.doc('attacker').set(testAttacker),
        testCollection.doc('defender').set(testDefender)
    ]);
});

test('attacker does not exist', async () => {
    await testCollection.doc('attacker').delete();
    expect(() => calculateAttack(testRequest, testResponse)).toThrowError();
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