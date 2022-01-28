import * as admin from 'firebase-admin';

import { getNonNull } from 'utils';
import { WeaponData, weaponSchema } from 'weapon';

interface DataLoader<Type> {
    loadSingle: (id: string) => Promise<Type>;
    loadMultiple: (ids: string[]) => Promise<Type[]>;
}

export const weaponDataLoader: DataLoader<WeaponData> = {
    loadSingle: async (id: string) => {
        const weaponsCollection = admin.firestore().collection('Weapons');
        const firestoreSnapshot = await weaponsCollection.doc(id).get();
        const data = getNonNull((getNonNull(firestoreSnapshot)).data());
        return weaponSchema.validateSync(data);
    },

    loadMultiple: async (ids: string[]) => {
        const weaponsCollection = admin.firestore().collection('Weapons');
        const firestoreSnapshots = await Promise.all(ids.map(id => weaponsCollection.doc(id).get()));
        return firestoreSnapshots
            .map((snapshot) => getNonNull(getNonNull(snapshot).data()))
            .map((data) => weaponSchema.validateSync(data));
    },
};