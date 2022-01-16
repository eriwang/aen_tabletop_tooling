import changeCharacterFp from 'src_firebase_functions/change_character_fp';

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';

import { getCharacterRepr } from 'tests/test_data';
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
    const testCharacter = getCharacterRepr();
    testCharacter['currentFp'] = 50;
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
    await expect(changeCharacterFp(request, testResponse)).rejects.toMatch('Unexpected mode "invalid"');
});

test('character does not exist', async () => {
    const request = buildRequest({
        characterId: 'dne',
        mode: 'set',
        amount: 5
    });
    await expect(changeCharacterFp(request, testResponse)).rejects.toMatch('Character "dne"');
});

test('set FP', async () => {
    const request = buildRequest({
        characterId: 'character',
        mode: 'set',
        amount: 5
    });
    await changeCharacterFp(request, testResponse);

    const charData = getNonNull((await testCollection.doc('character').get()).data());
    expect(charData['currentFp']).toBe(5);
});

test('adjust FP multiple times', async () => {
    const decreaseRequest = buildRequest({
        characterId: 'character',
        mode: 'adjust',
        amount: -5
    });
    await changeCharacterFp(decreaseRequest, testResponse);

    let charData = getNonNull((await testCollection.doc('character').get()).data());
    expect(charData['currentFp']).toBe(45);

    const increaseRequest = buildRequest({
        characterId: 'character',
        mode: 'adjust',
        amount: 3
    });
    await changeCharacterFp(increaseRequest, testResponse);

    charData = getNonNull((await testCollection.doc('character').get()).data());
    expect(charData['currentFp']).toBe(48);
});

test('response is correct', async () => {
    const request = buildRequest({
        characterId: 'character',
        mode: 'set',
        amount: 5
    });
    await changeCharacterFp(request, testResponse);

    expect(testResponse.send).toHaveBeenCalledWith({ characterId: 'character' });
});
