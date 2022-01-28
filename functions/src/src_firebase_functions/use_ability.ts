import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { Character } from 'character';
import { armorDataLoader, characterClassLoader, classDataLoader, profileClassLoader, weaponDataLoader }
    from 'firestore_utils/data_loaders';
import { AbilityData } from 'ability';
import { getNonNull } from 'utils';
import { Attribute } from 'base_game_enums';

interface UseAbilityArgs {
    characterId: string;
    abilityName: string;
}

function findAbilityOnChar(char: Character, abilityName: string) : AbilityData {
    let targetAbilityData = null;
    for (const abilityData of char.data.abilities) {
        if (abilityData.name !== abilityName) {
            continue;
        }

        if (targetAbilityData !== null) {
            throw new Error(
                `Found multiple appearances of ability name ${abilityName} on character ${char.data.name}`);
        }

        targetAbilityData = abilityData;
    }

    return getNonNull(targetAbilityData, `Could not find ability ${abilityName} on character ${char.data.name}`);
}

// We need to export these so our tests can set up the data in the right places
export const BEAR_HIDE_ARMOR_ID = 'zjZ435PB9VZCN9FLqyHl';
export const BEAR_CLAW_WEAPON_ID = 'Bear Claw';

async function useUrsineFormToBear(char: Character, charId: string) {
    const bearChar = char;
    const oldCon = char.getAttributeStat(Attribute.CON);
    const oldWis = char.getAttributeStat(Attribute.WIS);
    const oldStr = char.getAttributeStat(Attribute.STR);
    const oldInt = char.getAttributeStat(Attribute.INT);

    const bearHide = await armorDataLoader.loadSingle(BEAR_HIDE_ARMOR_ID);
    const bearClaw = await weaponDataLoader.loadSingle(BEAR_CLAW_WEAPON_ID);

    bearChar.data.attributes.CON = oldWis;
    bearChar.data.attributes.WIS = oldCon;
    bearChar.data.attributes.STR = oldInt;
    bearChar.data.attributes.INT = oldStr;

    bearChar.data.armor = bearHide.name;
    bearChar.data.resistanceToFlat = bearHide.resistanceToFlat;
    bearChar.data.resistanceToPercent = bearHide.resistanceToPercent;
    bearChar.data.weapons = [bearClaw];

    const hpDiff = char.data.maxHp - char.data.currentHp;
    const fpDiff = char.data.maxFp - char.data.currentFp;

    const className = (await profileClassLoader.loadSingle(char.data.internalMetadata.profileId)).getClass();
    const {hpPerCon, fpPerInt} = (await classDataLoader.loadSingle(className));

    bearChar.data.maxHp = hpPerCon * bearChar.getAttributeStat(Attribute.CON);
    bearChar.data.currentHp = bearChar.data.maxHp - hpDiff;

    bearChar.data.maxFp = fpPerInt * bearChar.getAttributeStat(Attribute.INT);
    bearChar.data.currentFp = bearChar.data.maxFp - fpDiff;

    await admin.firestore().collection('Characters').doc(charId).set(bearChar.data);
}

async function useUrsineFormFromBear(char: Character, charId: string) {

}

async function useUrsineForm(char: Character, charId: string) {
    if (char.data.internalMetadata.abilitiesInUse.includes('Ursine Form')) {
        await useUrsineFormFromBear(char, charId);
    }
    else {
        await useUrsineFormToBear(char, charId);
    }
}

export default functions.https.onCall(async (args: UseAbilityArgs) => {
    const char = await characterClassLoader.loadSingle(args.characterId);
    const ability = findAbilityOnChar(char, args.abilityName);

    switch (ability.name) {
        case 'Ursine Form':
            await useUrsineForm(char, args.characterId);
            break;

        default:
            throw new Error(`Received unsupported ability ${ability.name}`);
    }
});