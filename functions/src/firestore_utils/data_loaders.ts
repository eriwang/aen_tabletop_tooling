import * as admin from 'firebase-admin';
import * as yup from 'yup';

import { abilitySchema } from 'aen_shared';
import { armorSchema } from 'armor';
import { classSchema } from 'class';
import { Character, characterSchema } from 'character';
import { Profile, profileSchema } from 'profile';
import { raceSchema } from 'race';
import { getNonNull } from 'utils';
import { weaponSchema } from 'weapon';

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
            try {
                return schema.validateSync(data) as any as TypeData;
            }
            catch (error: any) {
                console.error(error.errors);
                throw new Error(`Data id "${id}" in collection "${collectionName}" fails validations`);
            }
        },

        loadMultiple: async (ids: string[]) => {
            const firestoreSnapshots = await Promise.all(ids.map(id => collection().doc(id).get()));
            return firestoreSnapshots
                .map((snapshot) => {
                    const data = getNonNull(
                        snapshot.data(), `Could not find id "${snapshot.id}" in collection "${collectionName}"`);
                    try {
                        return schema.validateSync(data) as any as TypeData;
                    }
                    catch (error: any) {
                        console.error(error.errors);
                        throw new Error(`Data id "${snapshot.id}" in collection "${collectionName}" fails validations`);
                    }
                });
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

export const abilityDataLoader = createDataLoader('Abilities', abilitySchema);
export const armorDataLoader = createDataLoader('Armors', armorSchema);
export const classDataLoader = createDataLoader('Classes', classSchema);
export const raceDataLoader = createDataLoader('Races', raceSchema);
export const weaponDataLoader = createDataLoader('Weapons', weaponSchema);

export const characterClassLoader = createClassLoader('Characters', characterSchema, Character);
export const profileClassLoader = createClassLoader('Profiles', profileSchema, Profile);
