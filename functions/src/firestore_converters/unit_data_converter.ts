import { Attribute, getAbbrevFromAttr } from 'base_game_enums';
import { DocumentData, QueryDocumentSnapshot, FirestoreDataConverter} from 'firebase-admin/firestore';
import { Unit } from 'unit';
import { enumerateEnumValues, getNonNull } from 'utils';

const unitDataConverter: FirestoreDataConverter<Unit> = {
    toFirestore: (unit: Unit) : DocumentData => {
        const documentData: DocumentData = {
            hpPerCon: unit.hpPerCon,
            fpPerInt: unit.fpPerInt,
            movement: unit.movement,
        };
        for (const attr of enumerateEnumValues<Attribute>(Attribute)) {
            documentData[getAbbrevFromAttr(attr)] = unit.getAttribute(attr);
        }

        return documentData;
    },

    fromFirestore: (snapshot: QueryDocumentSnapshot) : Unit => {
        const unitData = snapshot.data();
        const attributeToStat = {} as Record<Attribute, number>;
        for (const attr of enumerateEnumValues<Attribute>(Attribute)) {
            attributeToStat[attr] = getNonNull(unitData[getAbbrevFromAttr(attr)]);
        }

        const hpPerCon = getNonNull(unitData['hpPerCon']);
        const fpPerInt = getNonNull(unitData['fpPerInt']);
        const movement = getNonNull(unitData['movement']);
        return new Unit(attributeToStat, hpPerCon, fpPerInt, movement);
    },
};

export default unitDataConverter;