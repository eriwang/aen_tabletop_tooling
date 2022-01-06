import changeCharacterHp from 'src_firebase_functions/change_character_hp';

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';

import { getTestCharacterFirestoreRepr } from 'firestore_tests/utils';
import { getNonNull } from 'utils';

let testCollection: admin.firestore.CollectionReference;
let testEnv: RulesTestEnvironment;

const testResponse = { send: jest.fn() } as any as functions.Response;

beforeAll(async () => {
    admin.initializeApp();
    testEnv = await initializeTestEnvironment({});
    await testEnv.clearFirestore();
    testCollection = admin.firestore().collection('character');
});

beforeEach(() => {
    const testCharacter = getTestCharacterFirestoreRepr();
    testCharacter['currentHp'] = 100;
    return testCollection.doc('character').set(testCharacter);
});

afterAll(async () => {
    await testEnv.clearFirestore();
});

function buildRequest(body: any) : functions.https.Request {
    return {
        body: body
    } as any as functions.https.Request;
}

test('mode is invalid', async () => {
    const request = buildRequest({
        characterId: 'character',
        mode: 'invalid',
        amount: 5
    });
    await expect(changeCharacterHp(request, testResponse)).rejects.toMatch('Unexpected mode "invalid"');
});

test('character does not exist', async () => {
    const request = buildRequest({
        characterId: 'dne',
        mode: 'set',
        amount: 5
    });
    await expect(changeCharacterHp(request, testResponse)).rejects.toMatch('Character "dne"');
});

test('set HP', async () => {
    const request = buildRequest({
        characterId: 'character',
        mode: 'set',
        amount: 5
    });
    await changeCharacterHp(request, testResponse);

    const charData = getNonNull((await testCollection.doc('character').get()).data());
    expect(charData['currentHp']).toBe(5);
});

test('adjust HP multiple times', async () => {
    const decreaseRequest = buildRequest({
        characterId: 'character',
        mode: 'adjust',
        amount: -5
    });
    await changeCharacterHp(decreaseRequest, testResponse);

    let charData = getNonNull((await testCollection.doc('character').get()).data());
    expect(charData['currentHp']).toBe(95);

    const increaseRequest = buildRequest({
        characterId: 'character',
        mode: 'adjust',
        amount: 3
    });
    await changeCharacterHp(increaseRequest, testResponse);

    charData = getNonNull((await testCollection.doc('character').get()).data());
    expect(charData['currentHp']).toBe(98);
});

test('response is correct', async () => {
    const request = buildRequest({
        characterId: 'character',
        mode: 'set',
        amount: 5
    });
    await changeCharacterHp(request, testResponse);

    expect(testResponse.send).toHaveBeenCalledWith({ characterId: 'character' });
});
