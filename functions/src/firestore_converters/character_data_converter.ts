import { ResistanceStat } from 'armor';
import { Attribute, DamageType, getAbbrevFromAttr } from 'base_game_enums';
import { Character } from 'character';
import { DocumentData, QueryDocumentSnapshot, FirestoreDataConverter} from 'firebase-admin/firestore';
import { enumerateEnumValues, getNonNull } from 'utils';

const characterDataConverter: FirestoreDataConverter<Character> = {
    toFirestore: (char: Character) : DocumentData => {
        const documentData: DocumentData = {
            attributeToStat: {},
            resistanceToFlatStat: {},
            resistanceToPercentStat: {},
        };

        for (const attr of enumerateEnumValues<Attribute>(Attribute)) {
            documentData['attributeToStat'][getAbbrevFromAttr(attr)] = char.getAttributeStat(attr);
        }

        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            const resStat = char.getResistanceStat(damageType);
            const damageTypeStr = DamageType[damageType];
            documentData['resistanceToFlatStat'][damageTypeStr] = resStat.flat;
            documentData['resistanceToPercentStat'][damageTypeStr] = resStat.percent;
        }

        documentData['weapons'] = char.weapons;

        return documentData;
    },

    fromFirestore: (snapshot: QueryDocumentSnapshot) : Character => {
        const charData = snapshot.data();

        const attributeToStat = {} as Record<Attribute, number>;
        for (const attr of enumerateEnumValues<Attribute>(Attribute)) {
            attributeToStat[attr] = getNonNull(charData['attributeToStat'][getAbbrevFromAttr(attr)]);
        }

        const resistanceToResStat = {} as Record<DamageType, ResistanceStat>;
        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            const damageTypeStr = DamageType[damageType];
            resistanceToResStat[damageType] = {
                percent: getNonNull(charData['resistanceToPercentStat'][damageTypeStr]),
                flat: getNonNull(charData['resistanceToFlatStat'][damageTypeStr])
            };
        }

        return new Character(attributeToStat, resistanceToResStat, charData['weapons']);
    },
};

export default characterDataConverter;