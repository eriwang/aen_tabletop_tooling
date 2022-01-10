/*
Typically imports are done by writing relative paths (e.g. "./attack_calculator"). However, this project chooses to do
it based on adding "./src" list of paths looked at for imports. This plays poorly with Cloud Functions, which uses
Node's "require" function: "require" will only look for system libs or in node_modules if you don't provide a relative
or absolute path.
The ModuleAlias library hacks the "require" function to look in the specified path. We use __dirname because the
TypeScript transpiler will dump everything directly in the same directory.
 */
import ModuleAlias from 'module-alias';
ModuleAlias.addPath(__dirname);

import * as admin from 'firebase-admin';

import calculateAttack from 'src_firebase_functions/calculate_attack';
import { Profile} from 'profile';
import { Unit} from 'unit';
import { profileDataConverter, unitDataConverter } from 'firestore_utils/data_converters';
import { Character } from 'character';
import { getNonNull } from 'utils';

admin.initializeApp();
const profilesCollection = admin.firestore().collection('Profiles');
const unitsCollection = admin.firestore().collection('Units');

export { calculateAttack };

async function loadCharacterFromDatabase(unit: string, profile: string): Promise<Character>{
    let character: Character;
    let unitData: Unit | undefined;
    let profileData: Profile | undefined;

    unitData = getNonNull(await unitsCollection.doc(unit).withConverter(unitDataConverter).get()).data();
    profileData = getNonNull(await profilesCollection.doc(profile).withConverter(profileDataConverter).get()).data();

    if (unitData === undefined){
        throw new Error("Unit " + unit + " not found");
    }
    if (profileData === undefined){
        throw new Error("Profile " + profile + "not found")
    }
    
    //Cast because we confirmed that neither unitData or profileData are undefined
    character = Character.build(unitData as Unit, profileData as Profile);

    return character;

}