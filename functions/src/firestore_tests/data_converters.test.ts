import { characterDataConverter } from 'firestore_utils/data_converters';

import * as admin from 'firebase-admin';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';

import { Character, CharacterData } from 'character';
import { getNonNull } from 'utils';
import { getCharacterRepr } from 'tests/test_data';

let testCollection: admin.firestore.CollectionReference;
let testEnv: RulesTestEnvironment;

beforeAll(async () => {
    admin.initializeApp();
    testEnv = await initializeTestEnvironment({});
    await testEnv.clearFirestore();
    testCollection = admin.firestore().collection('collection');
});

afterAll(async () => {
    await testEnv.clearFirestore();
});

describe('example data converter', () => {
    let testCharacterData: CharacterData;
    beforeEach(() => {
        testCharacterData = getCharacterRepr();
    });

    test('toFirestore', async () => {
        const testCharacter = new Character(testCharacterData);
        await testCollection.withConverter(characterDataConverter).doc('charToFirestoreValid').set(testCharacter);
        expect((await testCollection.doc('charToFirestoreValid').get()).data()).toStrictEqual(testCharacterData);
    });

    test('fromFirestore valid', async () => {
        await testCollection.doc('charFromFirestoreValid').set(testCharacterData);
        const character = getNonNull((
            await testCollection.doc('charFromFirestoreValid').withConverter(characterDataConverter).get()
        ).data());
        expect(character.getMaxHp()).toBe(testCharacterData['maxHp']);
    });

    test('fromFirestore invalid', async () => {
        delete (testCharacterData.attributeToStat as any).CON;
        await testCollection.doc('charFromFirestoreInvalid').set(testCharacterData);
        const testDoc = await testCollection
            .doc('charFromFirestoreInvalid')
            .withConverter(characterDataConverter)
            .get();
        expect(() => testDoc.data()).toThrowError();
    });
});
