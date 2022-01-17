import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { Schema } from 'yup';

import { abilitySchema } from 'ability';
import { armorSchema } from 'armor';
import { characterSchema } from 'character';
import { classSchema } from 'class';
import { profileSchema } from 'profile';
import { raceSchema } from 'race';
import { weaponSchema } from 'weapon';
import { run } from 'tools/firestore_tool';

async function validateCollection(collectionName: string, schema: Schema) : Promise<number> {
    const db = getFirestore();
    let numErrors = 0;

    const querySnapshot = await getDocs(collection(db, collectionName));
    querySnapshot.forEach((doc) => {
        try {
            schema.validateSync(doc.data(), {abortEarly: false});
        }
        catch (e: any /* ValidationError */) {
            console.error(`Doc "${doc.id}" in collection "${collectionName}" does not match: \n    ${e.errors}`);
            numErrors++;
        }
    });

    return numErrors;
}

run(async () => {
    const COLLECTION_AND_SCHEMAS: [string, Schema][] = [
        ['Abilities', abilitySchema],
        ['Armors', armorSchema],
        ['Characters', characterSchema],
        ['Classes', classSchema],
        ['Profiles', profileSchema],
        ['Races', raceSchema],
        ['Weapons', weaponSchema],
    ];

    const collectionErrorCounts: [string, number][] = [];
    for (const [collectionName, schema] of COLLECTION_AND_SCHEMAS) {
        const numErrors = await validateCollection(collectionName, schema);
        if (numErrors > 0) {
            collectionErrorCounts.push([collectionName, numErrors]);
        }
    }

    if (collectionErrorCounts.length === 0) {
        return;
    }

    console.error('\n===SUMMARY===\n');

    collectionErrorCounts.forEach((collectionErrorCount) => {
        console.error(`Collection "${collectionErrorCount[0]}" has ${collectionErrorCount[1]} errors.`);
    });

    console.error('');
});