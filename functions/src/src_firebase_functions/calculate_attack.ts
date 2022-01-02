import * as admin from 'firebase-admin';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';

import { calculateDamage, calculateToHit } from 'attack_calculator';
import characterDataConverter from 'firestore_converters/character_data_converter';

/*
request.query: {
    attackerId: string,
    defenderId: string,
    weaponName: string,
    roll: number,
}
response: {
    doesAttackHit: boolean,
    attackerToHit: number,
    defenderEvade: number,
    damage: number,
}
 */
export default functions.https.onRequest(async (request, response) => {
    const attackerId = request.query.attackerId as string;
    const defenderId = request.query.defenderId as string;
    const weaponName = request.query.weaponName as string;
    const roll = parseInt(request.query.roll as string);

    const charCollection = admin.firestore().collection('character');
    const [attackerDoc, defenderDoc] = await admin.firestore().getAll(
        charCollection.doc(attackerId), charCollection.doc(defenderId)
    );

    if (attackerDoc.data() === undefined) {
        throw `Could not find attacker with id ${attackerId}`;
    }
    if (defenderDoc.data() === undefined) {
        throw `Could not find defender with id ${attackerId}`;
    }

    const attacker = characterDataConverter.fromFirestore(attackerDoc as QueryDocumentSnapshot);
    const defender = characterDataConverter.fromFirestore(defenderDoc as QueryDocumentSnapshot);

    let weapon = null;
    for (const w of attacker.weapons) {
        if (w.name === weaponName) {
            weapon = w;
            break;
        }
    }

    if (weapon === null) {
        throw `Could not find weapon on attacker with name ${weaponName}`;
    }

    const toHitResult = calculateToHit(roll, attacker, defender, weapon);
    const damage = calculateDamage(attacker, defender, weapon);

    response.send({
        doesAttackHit: toHitResult.doesAttackHit,
        attackerToHit: toHitResult.attackerToHit,
        defenderEvade: toHitResult.defenderEvade,
        damage: damage,
    });
});