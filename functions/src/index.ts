import * as functions from 'firebase-functions';

import { calculateToHit, calculateDamage, Attack } from './attack_calculator';
import { Character } from './character';

export const calculateAttack = functions.https.onRequest((request, response) => {
    functions.logger.info('Beginning to calculate attack');

    const toHitResult = calculateToHit(5, {} as Character, {} as Character, {} as Attack);
    const damage = calculateDamage({} as Character, {} as Character, {} as Attack);

    response.send(`${toHitResult}\n${damage}`);
});