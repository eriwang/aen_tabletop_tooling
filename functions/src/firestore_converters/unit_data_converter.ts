import { ResistanceStat } from 'armor';
import { Attribute, DamageType, getAbbrevFromAttr } from 'base_game_enums';
import { DocumentData, QueryDocumentSnapshot, FirestoreDataConverter} from 'firebase-admin/firestore';
import { Unit } from 'unit';

const unitDataConverter: FirestoreDataConverter<Unit> = {
    toFirestore: (unit: Unit) : DocumentData => {
        const documentData: DocumentData = {
        };
        return documentData;
    },

    fromFirestore: (snapshot: QueryDocumentSnapshot) : Unit => {
        const unitData = snapshot.data();
        return new Unit({} as any as Record<Attribute, number>, 0);
    },
};

export default unitDataConverter;