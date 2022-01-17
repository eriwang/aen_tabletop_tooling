import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { flail, splash, water, fish, pokemon, karp, magikarp}
    from 'firestore_tests/src_firebase_functions/test_character_magikarp';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import loadCharacter from 'src_firebase_functions/load_character';
import { getNonNull } from 'utils';
import { characterDataConverter } from 'firestore_utils/data_converters';

let profilesCollection: admin.firestore.CollectionReference;
let armorsCollection: admin.firestore.CollectionReference;
let weaponsCollection: admin.firestore.CollectionReference;
let charactersCollection: admin.firestore.CollectionReference;
let racesCollection: admin.firestore.CollectionReference;
let classesCollection: admin.firestore.CollectionReference;
let abilitiesCollection: admin.firestore.CollectionReference;
let testEnv: RulesTestEnvironment;

const testResponse = {send: jest.fn()} as any as functions.Response;

beforeAll(async () => {
    admin.initializeApp();
    testEnv = await initializeTestEnvironment({});
    await testEnv.clearFirestore();
    profilesCollection = admin.firestore().collection('Profiles');
    armorsCollection = admin.firestore().collection('Armors');
    weaponsCollection = admin.firestore().collection('Weapons');
    charactersCollection = admin.firestore().collection('Characters');
    racesCollection = admin.firestore().collection('Races');
    classesCollection = admin.firestore().collection('Classes');
    abilitiesCollection = admin.firestore().collection('Abilities');
});

beforeEach(async () => {
    await profilesCollection.doc('Magikarp').set(karp);
    await armorsCollection.doc('Water').set(water);
    await weaponsCollection.doc('Flail').set(flail);
    await racesCollection.doc('Fish').set(fish);
    await classesCollection.doc('Pokemon').set(pokemon);
    await abilitiesCollection.doc('Splash').set(splash);
});

afterAll(async () => {
    await testEnv.clearFirestore();
});

function buildRequest(body: any) : functions.https.Request {
    return {
        body: body
    } as any as functions.https.Request;
}

test('Create character Magikarp', async () => {
    const request = buildRequest({
        profile: 'Magikarp'
    });
    await loadCharacter(request, testResponse);

    const charData = getNonNull(getNonNull(await charactersCollection.doc('Magikarp').
        withConverter(characterDataConverter).get()).data());

    expect(charData.data).toStrictEqual(magikarp);
});