import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

/*
request.query: {
    attackerId: string,
    defenderId: string,
    weaponName: string,
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

    // pull both the attacker and the defender, fail if either doesn't exist
    // look up the weapon from the attacker, fail if it doesn't exist

    // call the downstream functions
    // fill in the response according to spec, send it back

    response.send(`${{damage: 5, toHit: 10}}}\ngoodbye`);
});