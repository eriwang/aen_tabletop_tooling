import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { calculateDamage, calculateToHit } from 'attack_calculator';
import { characterDataConverter } from 'firestore_utils/data_converters';

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
export default functions.https.onCall(async (data) => {
    const attackerId = data.attackerId as string;
    const defenderId = data.defenderId as string;
    const weaponName = data.weaponName as string;
    const roll = parseInt(data.roll as string);

    const charCollection = admin.firestore().collection('Character');
    const [attackerDoc, defenderDoc] = await admin.firestore().getAll(
        charCollection.doc(attackerId), charCollection.doc(defenderId)
    );

    if (attackerDoc.data() === undefined) {
        throw new functions.https.HttpsError('invalid-argument', `Could not find attacker with id ${attackerId}`);
    }
    if (defenderDoc.data() === undefined) {
        throw new functions.https.HttpsError('invalid-argument', `Could not find defender with id ${defenderId}`);
    }

    const attacker = characterDataConverter.fromFirestore(attackerDoc as admin.firestore.QueryDocumentSnapshot);
    const defender = characterDataConverter.fromFirestore(defenderDoc as admin.firestore.QueryDocumentSnapshot);

    let weapon = null;
    for (const w of attacker.getWeapons()) {
        if (w.name === weaponName) {
            weapon = w;
            break;
        }
    }

    if (weapon === null) {
        throw new functions.https.HttpsError(
            'invalid-argument', 
            `Could not find weapon on attacker with name ${weaponName}`
        );
    }

    const toHitResult = calculateToHit(roll, attacker, defender, weapon);
    const damage = calculateDamage(attacker, defender, weapon);

    return {
        doesAttackHit: toHitResult.doesAttackHit,
        attackerToHit: toHitResult.attackerToHit,
        defenderEvade: toHitResult.defenderEvade,
        damage: damage,
    };
});