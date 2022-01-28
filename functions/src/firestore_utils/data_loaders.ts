import * as admin from 'firebase-admin';
import * as yup from 'yup';

import { getNonNull } from 'utils';
import { weaponSchema } from 'weapon';
import { Character, characterSchema } from 'character';

interface DataLoader<TypeData> {
    loadSingle: (id: string) => Promise<TypeData>;
    loadMultiple: (ids: string[]) => Promise<TypeData[]>;
}

function createDataLoader<TypeData>(collectionName: string, schema: yup.ObjectSchema<TypeData>) : DataLoader<TypeData> {
    // We need to defer the execution of this until later because firestore might not have been initialized yet
    const collection = () => admin.firestore().collection(collectionName);
    return {
        loadSingle: async (id: string) => {
            const firestoreSnapshot = await collection().doc(id).get();
            const data = getNonNull(firestoreSnapshot.data(),
                `Could not find id "${id}" in collection "${collectionName}"`);
            return schema.validateSync(data) as any as TypeData;
        },

        loadMultiple: async (ids: string[]) => {
            const firestoreSnapshots = await Promise.all(ids.map(id => collection().doc(id).get()));
            return firestoreSnapshots
                .map((snapshot) =>
                    getNonNull(snapshot.data(),
                        `Could not find id "${snapshot.id}" in collection "${collectionName}"`))
                .map((data) => schema.validateSync(data) as any as TypeData);
        },
    };
}

function createClassLoader<Type, TypeData>
(collectionName: string, schema: yup.ObjectSchema<TypeData>, t: new (data: TypeData) => Type) : DataLoader<Type> {
    const dataLoader = createDataLoader(collectionName, schema);
    return {
        loadSingle: async (id: string) => new t(await dataLoader.loadSingle(id)),
        loadMultiple: async (ids: string[]) => (await dataLoader.loadMultiple(ids)).map((data) => new t(data)),
    };
}

export const weaponDataLoader = createDataLoader('Weapons', weaponSchema);

export const characterClassLoader = createClassLoader('Characters', characterSchema, Character);