import { ArmorData, armorSchema } from "armor";
import { Attribute, DamageType, getAbbrevFromAttr } from "base_game_enums";
import { Character, CharacterData } from "character";
import { characterDataConverter, profileDataConverter, unitDataConverter } from "firestore_utils/data_converters";
import { Profile } from "profile";
import { Unit } from "unit";
import { enumerateEnumValues, getNonNull } from "utils";
import { WeaponData, weaponSchema } from "weapon";

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';


const profilesCollection = admin.firestore().collection('Profiles');
const unitsCollection = admin.firestore().collection('Units');
const armorsCollection = admin.firestore().collection('Armors');
const weaponsCollection = admin.firestore().collection('Weapons')
const charactersCollection = admin.firestore().collection('Characters');

/*
request.query: {
    unit: string,
    profile: string,
}

response: {
    characterData
}
*/

export default functions.https.onRequest(async (request, response) =>{

    const unit: string = request.query.unit as string;
    const profile: string = request.query.profile as string;

    let unitData: Unit;
    let profileData: Profile;
    let armorData: ArmorData;
    let weaponData: WeaponData[] = [] as WeaponData[];
    let resultmap: any[] = [];

    unitData = getNonNull(getNonNull(await unitsCollection.doc(unit).withConverter(unitDataConverter).get()).data());
    profileData = getNonNull(getNonNull(await profilesCollection.doc(profile).withConverter(profileDataConverter).get()).data());

    if(profileData.getArmor() === undefined){
        let data = getNonNull(getNonNull(await armorsCollection.doc(profileData.getArmor()).get()).data());
        armorData = armorSchema.validateSync(data);
    }
    else{
        const noArmor: any = {}
        for (const element of enumerateEnumValues<DamageType>(DamageType)) {
            noArmor[element] = 0;
        }
        armorData = {} as ArmorData;
        armorData.resistanceToFlatStat = noArmor;
        armorData.resistanceToPercentStat = noArmor; 
    }

    profileData.getWeapon().forEach(element => {
        resultmap.push(getNonNull(weaponsCollection.doc(element).get()));

    });

    (await Promise.all(resultmap)).forEach(element => {
        let data = getNonNull(element.data());
        weaponData.push(weaponSchema.validateSync(data));
    });

    const attributeToStat: any = {};
    for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
        attributeToStat[getAbbrevFromAttr(attribute)] =
            unitData.getAttribute(attribute) + profileData.getAttributeStatDiff(attribute);
    }

    // For simplicity, set current HP to max HP every time we build a character
    const maxHp = attributeToStat['CON'] * unitData.getHpPerCon();
    const characterData: CharacterData = {
        attributeToStat: attributeToStat,
        resistanceToFlatStat: armorData!.resistanceToFlatStat,
        resistanceToPercentStat: armorData!.resistanceToPercentStat,
        maxHp: maxHp,
        currentHp: maxHp,
        weapons: weaponData,
    } as any as CharacterData;

    await charactersCollection.doc(profile).set(characterData);

    response.send(characterData);

});