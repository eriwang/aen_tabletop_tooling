import * as admin from 'firebase-admin';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';

import { getWeaponsRepr } from 'tests/test_data';
import { WeaponData } from 'weapon';
import { weaponDataLoader } from 'firestore_utils/data_loaders';

let testEnv: RulesTestEnvironment;
let weaponsCollection: admin.firestore.CollectionReference;

beforeAll(async () => {
    admin.initializeApp();
    testEnv = await initializeTestEnvironment({});
    await testEnv.clearFirestore();
    weaponsCollection = admin.firestore().collection('Weapons');
});

afterAll(async () => {
    await testEnv.clearFirestore();
});

describe('example data loader', () => {
    let testWeaponData1: WeaponData, testWeaponData2: WeaponData;
    beforeEach(() => {
        [testWeaponData1, testWeaponData2] = getWeaponsRepr();
    });

    test('loadSingle', async () => {
        await weaponsCollection.doc('weapon_id').set(testWeaponData1);
        expect(await weaponDataLoader.loadSingle('weapon_id')).toStrictEqual(testWeaponData1);
    });

    test('loadMultiple', async () => {
        await Promise.all([
            weaponsCollection.doc('weapon_id1').set(testWeaponData1),
            weaponsCollection.doc('weapon_id2').set(testWeaponData2),
        ]);

        const [result1, result2] = await weaponDataLoader.loadMultiple(['weapon_id1', 'weapon_id2']);
        expect(result1).toStrictEqual(testWeaponData1);
        expect(result2).toStrictEqual(testWeaponData2);
    });

    test('loadSingle invalid', async () => {
        delete (testWeaponData1 as any).attribute;
        await weaponsCollection.doc('weapon_id').set(testWeaponData1);
        expect(weaponDataLoader.loadSingle('weapon_id')).rejects.toThrow();
    });

    test('loadMultiple invalid', async () => {
        delete (testWeaponData2 as any).attribute;
        await Promise.all([
            weaponsCollection.doc('weapon_id1').set(testWeaponData1),
            weaponsCollection.doc('weapon_id2').set(testWeaponData2),
        ]);

        expect(weaponDataLoader.loadMultiple(['weapon_id1', 'weapon_id2'])).rejects.toThrow();
    });
});
