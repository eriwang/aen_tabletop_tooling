import { DocumentData, QueryDocumentSnapshot, FirestoreDataConverter} from 'firebase-admin/firestore';
import * as yup from 'yup';

import { Character, CharacterData, characterSchema } from 'character';

// To create a data converter, you must have a Class, a yup schema, and a yup-generated "ClassData" interface
function createDataConverter<Type extends {data: TypeData}, TypeData>
(t : new (data: TypeData) => Type, schema: yup.ObjectSchema<any>) : FirestoreDataConverter<Type> {
    return {
        toFirestore: (t: Type) : DocumentData => {
            return t.data;
        },
        fromFirestore: (snapshot: QueryDocumentSnapshot) : Type => {
            schema.validateSync(snapshot.data());
            return new t(snapshot.data() as any as TypeData);
        },
    };
}

export const characterDataConverter = createDataConverter<Character, CharacterData>(Character, characterSchema);
