import unitDataConverter from 'firestore_converters/unit_data_converter';

import * as admin from 'firebase-admin';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';

import { Unit } from 'unit';
import { enumerateEnumValues, getNonNull } from 'utils';
import { Attribute, getAbbrevFromAttr } from 'base_game_enums';
import { getUnitRepr } from 'firestore_tests/firestore_repr';

let testUnitData: any;
let testCollection: admin.firestore.CollectionReference;
let testEnv: RulesTestEnvironment;

beforeAll(async () => {
    admin.initializeApp();
    testEnv = await initializeTestEnvironment({});
    await testEnv.clearFirestore();
    testCollection = admin.firestore().collection('collection');
});

beforeEach(() => {
    testUnitData = getUnitRepr();
});

afterAll(async () => {
    await testEnv.clearFirestore();
});

test('toFirestore', async () => {
    const attributeToStat = {} as Record<Attribute, number>;
    for (const attr of enumerateEnumValues<Attribute>(Attribute)) {
        attributeToStat[attr] = testUnitData['attributeToStat'][getAbbrevFromAttr(attr)];
    }

    const testUnit = new Unit(
        attributeToStat, testUnitData['hpPerCon'], testUnitData['fpPerInt'], testUnitData['movement']);
    await testCollection.withConverter(unitDataConverter).doc('toFirestore').set(testUnit);
    expect((await testCollection.doc('toFirestore').get()).data()).toStrictEqual(testUnitData);
});

describe('fromFirestore', () => {
    test('valid value', async () => {
        await testCollection.doc('fromFirestoreValid').set(testUnitData);
        const unit = getNonNull((
            await testCollection.withConverter(unitDataConverter).doc('fromFirestoreValid').get()
        ).data());

        for (const attr of enumerateEnumValues<Attribute>(Attribute)) {
            expect(unit.getAttribute(attr)).toBe(testUnitData[getAbbrevFromAttr(attr)]);
        }

        expect(unit.fpPerInt).toBe(testUnitData['fpPerInt']);
        expect(unit.hpPerCon).toBe(testUnitData['hpPerCon']);
        expect(unit.movement).toBe(testUnitData['movement']);
    });

    test('missing attribute', async () => {
        delete testUnitData['CON'];
        await testCollection.doc('fromFirestoreMissingAttr').set(testUnitData);
        const testDoc = await testCollection
            .doc('fromFirestoreMissingAttr')
            .withConverter(unitDataConverter)
            .get();
        expect(() => testDoc.data()).toThrowError();
    });

    test('missing other value', async () => {
        delete testUnitData['movement'];
        await testCollection.doc('fromFirestoreMissingMvmt').set(testUnitData);
        const testDoc = await testCollection
            .doc('fromFirestoreMissingMvmt')
            .withConverter(unitDataConverter)
            .get();
        expect(() => testDoc.data()).toThrowError();
    });
});
