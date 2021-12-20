import * as admin from 'firebase-admin';

beforeAll(async () => {
    admin.initializeApp();
    await admin.firestore().collection('Characters').add({
        hello: 'goodbye'
    });
});

test('hello', async () => {
    const docs = await admin.firestore().collection('Characters').listDocuments();
    expect((await docs[0].get()).data()).toStrictEqual({hello: 'goodbye'});
});