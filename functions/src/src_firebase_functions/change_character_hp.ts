import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import characterDataConverter from 'firestore_converters/character_data_converter';

/*
request.body: {
    characterId: string,
    mode: string (<set|adjust>),
    amount: number,
}
response: {
    characterId: string
}
*/
export default functions.https.onRequest(async (request, response) => {
    const characterId = request.body.characterId as string;
    const mode = request.body.mode as string;
    const amount = parseInt(request.body.amount as string);

    if (mode !== 'set' && mode !== 'adjust') {
        throw `Unexpected mode "${mode}"`;
    }

    const characterDocRef = admin.firestore()
        .collection('character')
        .withConverter(characterDataConverter)
        .doc(characterId);

    const character = (await characterDocRef.get()).data();
    if (character === undefined) {
        throw `Character "${characterId}" was not found`;
    }

    if (mode === 'set') {
        character.currentHp = amount;
    }
    else {
        character.currentHp += amount;
    }

    await characterDocRef.set(character);

    response.send({
        characterId: characterId
    });
});