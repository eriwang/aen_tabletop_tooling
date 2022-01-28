import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { Character, CharacterData } from 'character';
import { abilityDataLoader, armorDataLoader, characterClassLoader, classDataLoader, profileClassLoader, raceDataLoader,
    weaponDataLoader }
    from 'firestore_utils/data_loaders';
import { AbilityData } from 'ability';
import { getNonNull } from 'utils';
import { Attribute } from 'base_game_enums';
import { calculateAttributes, calculateSkills } from './load_character';

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

    bearChar.data.internalMetadata.abilitiesInUse = ['Ursine Form'];

    await admin.firestore().collection('Characters').doc(charId).set(bearChar.data);
}

// TODO: This is quite literally a copy + paste + modify of load_character and is disgusting tech debt that can be fixed
//       by just making the code more modular and having both pull the same code then doing operations afterwards
async function useUrsineFormFromBear(char: Character, charId: string) {
    const profile = await profileClassLoader.loadSingle(char.data.internalMetadata.profileId);

    const classData = await classDataLoader.loadSingle(profile.getClass());
    const raceData = await raceDataLoader.loadSingle(profile.getRace());
    const armorData = await armorDataLoader.loadSingle(profile.getArmor());
    const weaponData = await weaponDataLoader.loadMultiple(profile.getWeapons());
    const abilityData = await abilityDataLoader.loadMultiple(profile.getAbilities());

    const attributes = calculateAttributes(profile);

    const maxHp = attributes.CON * classData.hpPerCon;
    const maxFp = attributes.INT * classData.fpPerInt;

    const hpDiff = char.data.maxHp - char.data.currentHp;
    const fpDiff = char.data.maxFp - char.data.currentFp;

    const characterData: CharacterData = {
        name: char.data.name,
        attributes: attributes,
        resistanceToFlat: armorData!.resistanceToFlat,
        resistanceToPercent: armorData!.resistanceToPercent,
        skills: calculateSkills(profile),
        maxHp: maxHp,
        currentHp: maxHp - hpDiff,
        maxFp: maxFp,
        currentFp: maxFp - fpDiff,
        level: profile.getLevel(),
        initiative: 0,
        cooldowns: ' ',
        statuses: ' ',
        armor: profile.getArmor(),
        race: profile.getRace(),
        class: profile.getClass(),
        movement: raceData.movement,
        weapons: weaponData,
        abilities: abilityData,

        internalMetadata: {
            profileId: char.data.internalMetadata.profileId,
            abilitiesInUse: [],
        }
    };

    await admin.firestore().collection('Characters').doc(charId).set(characterData);
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