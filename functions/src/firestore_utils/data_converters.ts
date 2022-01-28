import { DocumentData, QueryDocumentSnapshot, FirestoreDataConverter} from 'firebase-admin/firestore';
import * as yup from 'yup';

import { Character, CharacterData, characterSchema } from 'character';
import { Profile, ProfileData, profileSchema } from 'profile';

/*
==================================================================================================
THIS MODULE IS DEPRECATED IN FAVOR OF data_loaders.ts, DO NOT ADD TO THIS FILE
==================================================================================================
*/

// To create a data converter, you must have a Class, a yup schema, and a yup-generated "ClassData" interface
function createDataConverter<Type extends {data: TypeData}, TypeData>
(t : new (data: TypeData) => Type, schema: yup.ObjectSchema<any>) : FirestoreDataConverter<Type> {
    return {
        toFirestore: (t: Type) : DocumentData => {
            return t.data;
        },
        fromFirestore: (snapshot: QueryDocumentSnapshot) : Type => {
            return new t(schema.validateSync(snapshot.data()) as any as TypeData);
        },
    };
}

export const characterDataConverter = createDataConverter<Character, CharacterData>(Character, characterSchema);
export const profileDataConverter = createDataConverter<Profile, ProfileData>(Profile, profileSchema);