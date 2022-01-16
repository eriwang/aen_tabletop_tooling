import { ArmorData, armorSchema } from "armor";
import { Attribute, DamageType, getAbbrevFromAttr } from "base_game_enums";
import { CharacterData } from "character";
import { profileDataConverter } from "firestore_utils/data_converters";
import { Profile } from "profile";
import { ClassData, classSchema } from "class";
import { enumerateEnumValues, getNonNull } from "utils";
import { WeaponData, weaponSchema } from "weapon";

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { RaceData, raceSchema } from "race";
import { AbilityData, abilitySchema } from "ability";


const profilesCollection = admin.firestore().collection('Profiles');
const armorsCollection = admin.firestore().collection('Armors');
const weaponsCollection = admin.firestore().collection('Weapons')
const charactersCollection = admin.firestore().collection('Characters');
const racesCollection = admin.firestore().collection("Races");
const classesCollection = admin.firestore().collection("Classes");
const abilitiesCollection = admin.firestore().collection("Abilities");

//Loads armor resistances
//If the armor is "Naked", sets all resistances to 0.
//Profile.getArmor() will return "Naked" if the armor is undefined.
async function loadArmor(armor: string) : Promise<ArmorData> {
    let armorData: ArmorData;

    if(armor === "Naked"){
        const noArmor: any = {}
        for (const element of enumerateEnumValues<DamageType>(DamageType)) {
            noArmor[element] = 0;
        }
        armorData = {} as ArmorData;
        armorData.resistanceToFlatStat = noArmor;
        armorData.resistanceToPercentStat = noArmor; 
    }
    else{
        let data = getNonNull(getNonNull(await armorsCollection.doc(armor).get()).data());
        armorData = armorSchema.validateSync(data);
    }
    
    return armorData;

}

//Given a list of weapons from the profile
//Loads the weapons' data and returns an array with the data
async function loadWeapons(weapons: string[]) : Promise<WeaponData[]>{
    let resultmap: any[] = [];
    let weaponData: WeaponData[] = [] as WeaponData[];

    weapons.forEach(element => {
        resultmap.push(getNonNull(weaponsCollection.doc(element).get()));
    });

    (await Promise.all(resultmap)).forEach(element => {
        let data = getNonNull(element.data());
        weaponData.push(weaponSchema.validateSync(data));
    });

    return weaponData;
}

//Given a list of abilities from the profile
//Loads the abilities' data and returns an array with the data
async function loadAbilities(abilities: string[]) : Promise<AbilityData[]>{
    let resultmap: any[] = [];
    let abilityData: AbilityData[] = [] as AbilityData[];

    abilities.forEach(element => {
        resultmap.push(getNonNull(abilitiesCollection.doc(element).get()));
    });

    (await Promise.all(resultmap)).forEach(element => {
        let data = getNonNull(element.data());
        abilityData.push(abilitySchema.validateSync(data));
    });

    return abilityData;

}

//Calcuates final attributes from profile
function calculateAttributes(profileData: Profile) : any{
    const attributes: any = {};
    for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
        attributes[getAbbrevFromAttr(attribute)] =
            profileData.getAttributeStatTotal(attribute);
    }

    return attributes;
}

/*
request.query: {
    profile: string,
}

response: {
    characterData
}
*/

export default functions.https.onRequest(async (request, response) =>{

    const profile: string = request.query.profile as string;

    let profileData: Profile;
    let armorData: ArmorData;
    let weaponData: WeaponData[] = [] as WeaponData[];
    let abilityData: AbilityData[] = [] as AbilityData[];
    let classData: ClassData;
    let raceData: RaceData;
    let tempData: any;

    profileData = getNonNull(getNonNull(await profilesCollection.doc(profile).withConverter(profileDataConverter).get()).data());

    //Store class data temporarily then validate it
    tempData = getNonNull(getNonNull(await classesCollection.doc(profileData.getClass()).get()).data());
    classData = classSchema.validateSync(tempData);

    //Store race data temporarily then validate it
    tempData = getNonNull(getNonNull(await racesCollection.doc(profileData.getRace()).get()).data());
    raceData = raceSchema.validateSync(tempData);

    armorData = await loadArmor(profileData.getArmor());

    weaponData = await loadWeapons(profileData.getWeapons());

    abilityData = await loadAbilities(profileData.getAbilities());

    const attributes = calculateAttributes(profileData);

    // For simplicity, set current HP to max HP every time we build a character
    const maxHp = attributes['CON'] * classData.hpPerCon;
    const maxFP = attributes['INT'] * classData.fpPerInt;
    const characterData: CharacterData = {
        attributes: attributes,
        resistanceToFlatStat: armorData!.resistanceToFlatStat,
        resistanceToPercentStat: armorData!.resistanceToPercentStat,
        maxHp: maxHp,
        currentHp: maxHp,
        maxFP: maxFP,
        currentFP: maxFP,
        initiative: 0,
        cooldowns: "",
        statues: "",
        armor: profileData.getArmor(),
        race: profileData.getRace(),
        class: profileData.getClass(),
        weapons: weaponData,
        abilities: abilityData,
    } as any as CharacterData;

    await charactersCollection.doc(profile).set(characterData);

    response.send(characterData);

});