import * as admin from 'firebase-admin';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';

import { calculateDamage, calculateToHit } from 'attack_calculator';
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

    response.send({
        characterId: characterId
    });
});