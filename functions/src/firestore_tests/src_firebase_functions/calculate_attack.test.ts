import calculateAttack from 'src_firebase_functions/calculate_attack';

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

let testCollection: admin.firestore.CollectionReference;
const TEST_REQUEST = {
    query: {
        attackerId: 'attacker',
        defenderId: 'defender',
        weaponId: 'weapon',
        roll: 5,
    }
} as any as functions.https.Request;

beforeAll(() => {
    admin.initializeApp();

    // Generate a random collection name to avoid interfering with other tests
    const randomCollectionName = Math.random().toString(36).slice(2);
    testCollection = admin.firestore().collection(randomCollectionName);
});

test('missing required params', () => {
    expect(() => calculateAttack({} as any as functions.Request, {} as functions.Response)).toBe(6);
});

test('attacker does not exist', () => {

});

test('defender does not exist', () => {

});

test('weaponId does not exist on attacker', () => {

});

test('calls downstream correctly and returns results', () => {

});