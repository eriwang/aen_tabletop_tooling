import characterDataConverter from 'firestore_converters/character_data_converter';

import * as admin from 'firebase-admin';
import { CollectionReference } from 'firebase-admin/firestore';
import { Character } from 'character';
import { enumerateEnumValues } from 'utils';
import { DamageType } from 'base_game_enums';
import { ResistanceStat } from 'armor';

let testCharacterData: any;
let testCollection: CollectionReference;

beforeAll(() => {
    admin.initializeApp();

    // Generate a random collection name to avoid interfering with other tests
    const randomCollectionName = Math.random().toString(36).slice(2);
    testCollection = admin.firestore().collection(randomCollectionName);
});

beforeEach(() => {
    testCharacterData = {
        attributeToStat: {
            CON: 1,
            STR: 2,
            DEX: 3,
            WIS: 4,
            INT: 5,
            CHAR: 6,
        },
        resistanceToFlatStat: {
            Slashing: 1,
            Bludgeoning: 2,
            Piercing: 3,
            Fire: 4,
            Water: 5,
            Air: 6,
            Earth: 7,
            Poison: 8,
            Radiant: 9,
            Necrotic: 10,
            Psychic: 11,
        },
        resistanceToPercentStat: {
            Slashing: 10,
            Bludgeoning: 20,
            Piercing: 30,
            Fire: 40,
            Water: 50,
            Air: 60,
            Earth: 70,
            Poison: 80,
            Radiant: 90,
            Necrotic: 100,
            Psychic: 110,
        }
    };
});

test('toFirestore', async () => {
    const resistanceToResStat = {} as Record<DamageType, ResistanceStat>;
    for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
        resistanceToResStat[damageType] = {
            percent: testCharacterData['resistanceToPercentStat'][damageType],
            flat: testCharacterData['resistanceToFlatStat'][damageType],
        };
    }
    const testCharacter = new Character(testCharacterData.attributeToStat, resistanceToResStat);

    await testCollection.withConverter(characterDataConverter).doc('toFirestoreValid').set(testCharacter);
    expect((await testCollection.doc('toFirestoreValid').get()).data()).toStrictEqual(testCharacterData);
});

describe('fromFirestore', () => {
    test('valid value', async () => {
        await testCollection.doc('fromFirestoreValid').set(testCharacterData);
    });

    test('missing attribute', async () => {
        delete testCharacterData['attributeToStat']['CON'];
        await testCollection.doc('fromFirestoreMissingAttr').set(testCharacterData);
    });

    test('missing resistance', async () => {
        delete testCharacterData['resistanceToFlatStat']['Slashing'];
        await testCollection.doc('fromFirestoreMissingRes').set(testCharacterData);
    });
});