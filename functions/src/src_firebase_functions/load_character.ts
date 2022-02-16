import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { Attribute, Skills } from 'base_game_enums';
import { CharacterData } from 'character';
import { Profile } from 'profile';
import { enumerateEnumValues } from 'utils';
import { AttributesData, SkillsData } from 'schemas';
import { abilityDataLoader, armorDataLoader, classDataLoader, profileClassLoader, raceDataLoader, weaponDataLoader }
    from 'firestore_utils/data_loaders';

export function calculateAttributes(profile: Profile) : AttributesData {
    const attributes: any = {};
    for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
        attributes[attribute] = profile.getAttributeTotal(attribute);
    }

    return attributes;
}

export function calculateSkills(profile: Profile) : SkillsData {
    const skills: any = {};
    for (const skill of enumerateEnumValues<Skills>(Skills)) {
        skills[Skills[skill]] = profile.getSkillTotal(skill);
    }

    return skills;
}

/*
request.body: {
    profile: string,
}

response: {
    characterId: string,
}
*/
export default functions.https.onCall(async (data) => {

    const profileName: string = data.profile as string;

    const characterId = await createCharacter(profileName);

    return {
        characterId: characterId,
    };
});

async function createCharacter(profileName: string) : Promise<string> {
    const profile = await profileClassLoader.loadSingle(profileName);

    const classData = await classDataLoader.loadSingle(profile.getClass());
    const raceData = await raceDataLoader.loadSingle(profile.getRace());
    const armorData = await armorDataLoader.loadSingle(profile.getArmor());
    const weaponData = await weaponDataLoader.loadMultiple(profile.getWeapons());
    const abilityData = await abilityDataLoader.loadMultiple(profile.getAbilities());

    const attributes = calculateAttributes(profile);

    // For simplicity, set current HP to max HP every time we build a character
    const maxHp = attributes.CON * classData.hpPerCon;
    const maxFP = attributes.INT * classData.fpPerInt;
    const characterData: CharacterData = {
        name: profileName,
        attributes: attributes,
        resistanceToFlat: armorData!.resistanceToFlat,
        resistanceToPercent: armorData!.resistanceToPercent,
        skills: calculateSkills(profile),
        maxHp: maxHp,
        currentHp: maxHp,
        maxFp: maxFP,
        currentFp: maxFP,
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
            profileId: profileName,
            abilitiesInUse: [],
        }
    };

    let characterId = profile.getCharacterId();

    if (!characterId) {
        characterId = (await admin.firestore().collection('Characters').add(characterData)).id;
        profile.setCharacterId(characterId);
        await admin.firestore().collection('Profiles').doc(profileName).set(profile.data);
    }
    else {
        await admin.firestore().collection('Characters').doc(characterId).set(characterData);
    }

    return characterId;


}