import { collection, getDocs, setDoc, getFirestore, doc, QueryDocumentSnapshot, DocumentData }
    from 'firebase/firestore';

import { run } from 'tools/firestore_tool';
import { weaponSchema } from 'weapon';

/*
To use this script, modify code at the top of this file to suit your use case, then run using
`yarn run-tool <filename>`. To run for real, add the `--real-run` flag.

For simplicity in this side project, we'll just keep on changing this file whenever we need to modify a schema, as we
aren't too concerned about what schemas used to look like.
A better practice might be to have dedicated migration scripts for each migration to track what changed.
*/
const SOURCE_COLLECTION_NAME = 'Weapons';
const DEST_COLLECTION_NAME = 'Weapons';
const DEST_SCHEMA = weaponSchema;

function convertDocToTarget(doc: QueryDocumentSnapshot<DocumentData>) : any {
    const data = doc.data();
    data.hitDC = data.difficultyClass;
    data.range = 0;
    delete data.difficultyClass;

    // const destData: ClassData = {
    //     name: doc.id,
    //     hpPerCon: data['HP/CON'],
    //     fpPerInt: (data['FP/CON']) ? data['FP/CON'] : data['FP/INT'],  // there's a typo in the db
    // };

    return DEST_SCHEMA.validateSync(data);
}

/*
!!!!!!!!!! Warning !!!!!!!!!!

The below code should not be modified in regular use of this script. Only modify the below code if you need to make
changes to how exactly the script runs going forward.
*/

run(async () => {
    const db = getFirestore();

    const querySnapshot = await getDocs(collection(db, SOURCE_COLLECTION_NAME));
    const targetData: [string, any][] = [];
    querySnapshot.forEach((doc) => {
        targetData.push([doc.id, convertDocToTarget(doc)]);
    });

    if (process.argv.length < 3 || process.argv[2] !== '--real-run') {
        console.log(`The following documents in "${DEST_COLLECTION_NAME}" will be replaced:\n`);
        targetData.forEach((idAndData) => console.log(`${idAndData[0]}: ${JSON.stringify(idAndData[1], null, 4)}`));
    }
    else {
        await Promise.all(
            targetData.map(
                (idAndData) => setDoc(doc(db, DEST_COLLECTION_NAME, idAndData[0]), idAndData[1])
            )
        );
    }
});
