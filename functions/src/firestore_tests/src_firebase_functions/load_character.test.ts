import * as admin from 'firebase-admin';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { flail, splash, water, fish, pokemon, karp, magikarpLvl100, magikarpLvl1}
    from 'firestore_tests/src_firebase_functions/test_character_magikarp';
import loadCharacter from 'src_firebase_functions/load_character';
import { getNonNull } from 'utils';
import { characterDataConverter, profileDataConverter } from 'firestore_utils/data_converters';
import fftest from 'firebase-functions-test';

let profilesCollection: admin.firestore.CollectionReference;
let armorsCollection: admin.firestore.CollectionReference;
let weaponsCollection: admin.firestore.CollectionReference;
let charactersCollection: admin.firestore.CollectionReference;
let racesCollection: admin.firestore.CollectionReference;
let classesCollection: admin.firestore.CollectionReference;
let abilitiesCollection: admin.firestore.CollectionReference;
let testEnv: RulesTestEnvironment;

const wrapped = fftest().wrap(loadCharacter);

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

test('Create character Magikarp', async () => {
    let testdata = {profile: 'Magikarp'};
    const result = await wrapped(testdata);

    const charData = getNonNull(getNonNull(await charactersCollection.doc(result['characterId']).
        withConverter(characterDataConverter).get()).data());

    const profData = getNonNull(getNonNull(await profilesCollection.doc('Magikarp').
        withConverter(profileDataConverter).get()).data());

    expect(charData.data).toStrictEqual(magikarpLvl1);
    expect(result['characterId']).toStrictEqual(profData.data.characterId);
});

test('Magikarp was fed 99 rare candies', async () => {

    karp.level = 100;

    await profilesCollection.doc('Magikarp').set(karp);

    let testdata = {profile: 'Magikarp'};
    const result = await wrapped(testdata);

    const charData = getNonNull(getNonNull(await charactersCollection.doc(result['characterId']).
        withConverter(characterDataConverter).get()).data());

    const profData = getNonNull(getNonNull(await profilesCollection.doc('Magikarp').
        withConverter(profileDataConverter).get()).data());

    expect(charData.data).toStrictEqual(magikarpLvl100);
    expect(result['characterId']).toStrictEqual(profData.data.characterId);

});