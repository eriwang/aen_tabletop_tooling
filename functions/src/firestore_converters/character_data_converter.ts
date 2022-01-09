import { DocumentData, QueryDocumentSnapshot, FirestoreDataConverter} from 'firebase-admin/firestore';

import { Character, CharacterData, characterSchema } from 'character';

const characterDataConverter: FirestoreDataConverter<Character> = {
    toFirestore: (char: Character) : DocumentData => {
        return {
            attributeToStat: char.data.attributeToStat,
            resistanceToFlatStat: char.data.resistanceToFlatStat,
            resistanceToPercentStat: char.data.resistanceToPercentStat,
            maxHp: char.data.maxHp,
            currentHp: char.data.currentHp,
            weapons: char.data.weapons,
        };
    },

    fromFirestore: (snapshot: QueryDocumentSnapshot) : Character => {
        const charData = snapshot.data();

        characterSchema.validateSync(charData);

        return new Character(charData as any as CharacterData);
    },
};

export default characterDataConverter;