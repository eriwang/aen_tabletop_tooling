import characterDataConverter from 'firestore_converters/character_data_converter';

import * as admin from 'firebase-admin';
import { Character } from 'character';
import { enumerateEnumValues, getNonNull } from 'utils';
import { Attribute, DamageType, getAbbrevFromAttr } from 'base_game_enums';
import { ResistanceStat } from 'armor';

let testCharacterData: any;
let testCollection: admin.firestore.CollectionReference;

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
        },
        weapons: [
            {
                attribute: Attribute.Strength,
            },
            {
                attribute: Attribute.Intelligence,
            }
        ]
    };
});

test('toFirestore', async () => {
    const attributeToStat = {} as Record<Attribute, number>;
    for (const attr of enumerateEnumValues<Attribute>(Attribute)) {
        attributeToStat[attr] = testCharacterData['attributeToStat'][getAbbrevFromAttr(attr)];
    }

    const resistanceToResStat = {} as Record<DamageType, ResistanceStat>;
    for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
        const damageTypeStr = DamageType[damageType];
        resistanceToResStat[damageType] = {
            percent: testCharacterData['resistanceToPercentStat'][damageTypeStr],
            flat: testCharacterData['resistanceToFlatStat'][damageTypeStr],
        };
    }
    const testCharacter = new Character(attributeToStat, resistanceToResStat, testCharacterData['weapons']);

    await testCollection.withConverter(characterDataConverter).doc('toFirestoreValid').set(testCharacter);
    expect((await testCollection.doc('toFirestoreValid').get()).data()).toStrictEqual(testCharacterData);
});

describe('fromFirestore', () => {
    test('valid value', async () => {
        await testCollection.doc('fromFirestoreValid').set(testCharacterData);
        const character = getNonNull((
            await testCollection.doc('fromFirestoreValid').withConverter(characterDataConverter).get()
        ).data());

        for (const attr of enumerateEnumValues<Attribute>(Attribute)) {
            expect(character.getAttributeStat(attr))
                .toBe(testCharacterData['attributeToStat'][getAbbrevFromAttr(attr)]);
        }

        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            expect(character.getResistanceStat(damageType)).toStrictEqual({
                percent: testCharacterData['resistanceToPercentStat'][DamageType[damageType]],
                flat: testCharacterData['resistanceToFlatStat'][DamageType[damageType]],
            });
        }

        expect(character.weapons).toHaveLength(2);
    });

    test('missing attribute', async () => {
        delete testCharacterData['attributeToStat']['CON'];
        await testCollection.doc('fromFirestoreMissingAttr').set(testCharacterData);
        const testDoc = await testCollection
            .doc('fromFirestoreMissingAttr')
            .withConverter(characterDataConverter)
            .get();
        expect(() => testDoc.data()).toThrowError();
    });

    test('missing resistance', async () => {
        delete testCharacterData['resistanceToFlatStat']['Slashing'];
        await testCollection.doc('fromFirestoreMissingRes').set(testCharacterData);
        const testDoc = await testCollection
            .withConverter(characterDataConverter)
            .doc('fromFirestoreMissingRes')
            .get();
        expect(() => testDoc.data()).toThrowError();
    });
});
