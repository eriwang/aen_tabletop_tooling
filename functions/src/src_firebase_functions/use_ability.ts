import * as functions from 'firebase-functions';

interface UseAbilityArgs {
    characterId: string;
    abilityName: string;
}

export default functions.https.onCall(async (args: UseAbilityArgs) => {
});