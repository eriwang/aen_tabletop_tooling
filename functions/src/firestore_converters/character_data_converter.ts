import { Character } from 'character';
import { DocumentData, QueryDocumentSnapshot, FirestoreDataConverter} from 'firebase-admin/firestore';

const characterDataConverter: FirestoreDataConverter<Character> = {
    toFirestore: (char: Character) : DocumentData => {
        return {} as any as DocumentData;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) : Character => {
        return {} as any as Character;
    },
};

export default characterDataConverter;