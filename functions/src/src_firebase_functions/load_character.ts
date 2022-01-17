import { ArmorData, armorSchema } from 'armor';
import { Attribute, DamageType, Skills } from 'base_game_enums';
import { CharacterData } from 'character';
import { profileDataConverter } from 'firestore_utils/data_converters';
import { Profile } from 'profile';
import { classSchema } from 'class';
import { enumerateEnumValues, getNonNull } from 'utils';
import { WeaponData, weaponSchema } from 'weapon';

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { raceSchema } from 'race';
import { AbilityData, abilitySchema } from 'ability';

// Loads armor resistances
// If the armor is "Naked", sets all resistances to 0.
// Profile.getArmor() will return "Naked" if the armor is undefined.
async function loadArmor(armor: string) : Promise<ArmorData> {
    let armorData: ArmorData;
    const armorsCollection = admin.firestore().collection('Armors');

    if (armor === 'Naked') {
        const noArmor: any = {};
        for (const element of enumerateEnumValues<DamageType>(DamageType)) {
            noArmor[element] = 0;
        }
        armorData = {} as ArmorData;
        armorData.resistanceToFlat = noArmor;
        armorData.resistanceToPercent = noArmor;
    }
    else {
        try {
            let data = getNonNull(getNonNull(await armorsCollection.doc(armor).get()).data());
            armorData = armorSchema.validateSync(data);
        }
        catch {
            throw `Armor "${armor}" was not found`;
        }
    }

    return armorData;

}

// Given a list of weapons from the profile
// Loads the weapons' data and returns an array with the data
async function loadWeapons(weapons: string[]) : Promise<WeaponData[]> {
    let resultmap: any[] = [];
    let weaponData: WeaponData[] = [] as WeaponData[];
    const weaponsCollection = admin.firestore().collection('Weapons');

    weapons.forEach(element => {
        resultmap.push(getNonNull(weaponsCollection.doc(element).get()));
    });

    (await Promise.all(resultmap)).forEach(element => {
        try {
            let data = getNonNull(element.data());
            weaponData.push(weaponSchema.validateSync(data));
        }
        catch {
            throw 'Weapon was not found';
        }
    });

    return weaponData;
}

// Given a list of abilities from the profile
// Loads the abilities' data and returns an array with the data
async function loadAbilities(abilities: string[]) : Promise<AbilityData[]> {
    let resultmap: any[] = [];
    let abilityData: AbilityData[] = [] as AbilityData[];
    const abilitiesCollection = admin.firestore().collection('Abilities');

    abilities.forEach(element => {
        resultmap.push(getNonNull(abilitiesCollection.doc(element).get()));
    });

    (await Promise.all(resultmap)).forEach(element => {
        try {
            let data = getNonNull(element.data());
            abilityData.push(abilitySchema.validateSync(data));
        }
        catch {
            throw 'Ability was not found';
        }
    });

    return abilityData;

}

function calculateAttributes(profileData: Profile) : any {
    const attributes: any = {};
    for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
        attributes[attribute] = profileData.getAttributeTotal(attribute);
    }

    return attributes;
}

function calculateSkills(profileData: Profile) : any {
    const skills: any = {};

    for (const skill of enumerateEnumValues<Skills>(Skills)) {
        skills[Skills[skill]] = profileData.getSkillTotal(skill);
    }

    return skills;
}

/*
request.body: {
    profile: string,
}

response: {
    characterData
}
*/
export default functions.https.onRequest(async (request, response) =>{

    const profileName: string = request.body.profile as string;
    const profilesCollection = admin.firestore().collection('Profiles');
    const charactersCollection = admin.firestore().collection('Characters');
    const racesCollection = admin.firestore().collection('Races');
    const classesCollection = admin.firestore().collection('Classes');

    const profile = getNonNull(getNonNull(
        await profilesCollection.doc(profileName).withConverter(profileDataConverter).get()
    ).data());

    const classData = classSchema.validateSync(
        getNonNull(getNonNull(await classesCollection.doc(profile.getClass()).get()).data())
    );
    const raceData = raceSchema.validateSync(
        getNonNull(getNonNull(await racesCollection.doc(profile.getRace()).get()).data())
    );

    const armorData = await loadArmor(profile.getArmor());
    const weaponData = await loadWeapons(profile.getWeapons());
    const abilityData = await loadAbilities(profile.getAbilities());

    const attributes = calculateAttributes(profile);
    const skills = calculateSkills(profile);

    // For simplicity, set current HP to max HP every time we build a character
    const maxHp = attributes['CON'] * classData.hpPerCon;
    const maxFP = attributes['INT'] * classData.fpPerInt;
    const characterData: CharacterData = {
        name: profileName,
        attributes: attributes,
        resistanceToFlat: armorData!.resistanceToFlat,
        resistanceToPercent: armorData!.resistanceToPercent,
        skills: skills,
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
    };

    await charactersCollection.doc(profileName).set(characterData);

    response.send(characterData);

});