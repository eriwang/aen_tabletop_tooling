import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

/*
request.query: {
    attackerId: string,
    defenderId: string,
    weaponId: string,
    roll: number,
}
response: {
    attackerToHit: number,
    defenderEvade: number,
    didHit: boolean,
    damage: number,
}
 */
export default functions.https.onRequest((request, response) => {
    functions.logger.info('Beginning to calculate attack');

    response.send(`${{damage: 5, toHit: 10}}}\ngoodbye`);
});