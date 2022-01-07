import unitDataConverter from 'firestore_converters/unit_data_converter';

import * as admin from 'firebase-admin';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';

import { Unit } from 'unit';
import { enumerateEnumValues, getNonNull } from 'utils';
import { Attribute, DamageType, getAbbrevFromAttr } from 'base_game_enums';
import { ResistanceStat } from 'armor';
import { getTestCharacterFirestoreRepr } from 'firestore_tests/utils';

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
    testUnitData = {};
});

afterAll(async () => {
    await testEnv.clearFirestore();
});

test('toFirestore', async () => {
});

describe('fromFirestore', () => {
    test('valid value', async () => {
    });

    test('missing attribute', async () => {
    });

    test('missing resistance', async () => {
    });
});
