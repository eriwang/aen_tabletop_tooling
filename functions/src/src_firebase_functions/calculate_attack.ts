import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { calculateDamage, calculateToHit } from 'attack_calculator';
import { characterDataConverter } from 'firestore_utils/data_converters';
import { getNonNull } from 'utils';

function getAttack<T extends {name: string}>(name: string, attackType: string, attackList: T[]) : T | null {
    let attack = null;
    for (const a of attackList) {
        if (a.name !== name) {
            continue;
        }

        if (attack !== null) {
            throw new functions.https.HttpsError(
                'failed-precondition',
                `Character is invalid, found multiple ${attackType} objects with name ${name}`
            );
        }

        attack = a;
    }

    return attack;
}

/*
request.query: {
    attackerId: string,
    defenderId: string,
    attackName: string,
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
    const attackName = data.attackName as string;
    const roll = parseInt(data.roll as string);

    const charCollection = admin.firestore().collection('Characters');
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

    const weapon = getAttack(attackName, 'weapon', attacker.data.weapons);
    const ability = getAttack(attackName, 'ability', attacker.data.abilities);

    if (weapon === null && ability === null) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            `Could not find weapon or ability with name ${attackName} on attacker`
        );
    }
    if (weapon !== null && ability !== null) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            `Character is invalid, found both a weapon and an ability with name ${attackName}`
        );
    }

    const attack = getNonNull((weapon !== null) ? weapon : ability);
    const toHitResult = calculateToHit(roll, attacker, defender, attack);
    const damage = calculateDamage(attacker, defender, attack);

    return {
        doesAttackHit: toHitResult.doesAttackHit,
        attackerToHit: toHitResult.attackerToHit,
        defenderEvade: toHitResult.defenderEvade,
        damage: damage,
    };
});