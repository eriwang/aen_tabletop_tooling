import * as functions from 'firebase-functions';

interface UseAbilityArgs {
    characterId: string;
    abilityName: string;
}

// We need to export these so our tests can set up the data in the right places
export const BEAR_CLAW_WEAPON_ID = 'Bear Claw';
export const BEAR_HIDE_ARMOR_ID = 'zjZ435PB9VZCN9FLqyHl';

export default functions.https.onCall(async (args: UseAbilityArgs) => {

});