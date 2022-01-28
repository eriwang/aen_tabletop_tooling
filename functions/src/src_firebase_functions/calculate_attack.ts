import * as functions from 'firebase-functions';

import { calculateDamage, calculateToHit } from 'attack_calculator';
import { getNonNull } from 'utils';
import { characterClassLoader } from 'firestore_utils/data_loaders';

interface CalculateAttackArgs {
    attackerId: string;
    defenderId: string;
    attackName: string;
    roll: number;
}

interface CalculateAttackResponse {
    doesAttackHit: boolean;
    attackerToHit: number;
    defenderEvade: number;
    damage: number;
}

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

export default functions.https.onCall(async (args: CalculateAttackArgs) : Promise<CalculateAttackResponse> => {
    const [attacker, defender] = await characterClassLoader.loadMultiple([args.attackerId, args.defenderId]);

    const weapon = getAttack(args.attackName, 'weapon', attacker.data.weapons);
    const ability = getAttack(args.attackName, 'ability', attacker.data.abilities);

    if (weapon === null && ability === null) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            `Could not find weapon or ability with name ${args.attackName} on attacker`
        );
    }
    if (weapon !== null && ability !== null) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            `Character is invalid, found both a weapon and an ability with name ${args.attackName}`
        );
    }

    const attack = getNonNull((weapon !== null) ? weapon : ability);
    const toHitResult = calculateToHit(args.roll, attacker, defender, attack);
    const damage = calculateDamage(attacker, defender, attack);

    return {
        doesAttackHit: toHitResult.doesAttackHit,
        attackerToHit: toHitResult.attackerToHit,
        defenderEvade: toHitResult.defenderEvade,
        damage: damage,
    };
});