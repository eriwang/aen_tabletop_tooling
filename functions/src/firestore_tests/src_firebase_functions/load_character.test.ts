import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';

let profilesCollection: admin.firestore.CollectionReference;
let unitsCollection: admin.firestore.CollectionReference;
let armorsCollection: admin.firestore.CollectionReference;
let weaponsCollection: admin.firestore.CollectionReference;
let charactersCollection: admin.firestore.CollectionReference;
let testEnv: RulesTestEnvironment;

let testRequest: functions.https.Request;
const testRsponse = {send: jest.fn()} as any as functions.Response;

beforeAll(async() => {
    admin.initializeApp();
    testEnv = await initializeTestEnvironment({});
    await testEnv.clearFirestore();
    profilesCollection = admin.firestore().collection('Profiles');
});