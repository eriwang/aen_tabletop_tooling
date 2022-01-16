import * as fs from 'fs';

import { parse } from 'csv-parse';
import { collection, getFirestore, addDoc } from 'firebase/firestore';

async function readFromCSV(filename: string) {
    return new Promise<any>((resolve) => {
        fs.createReadStream(filename).pipe(
            parse({columns: true}, (err, data) => resolve(data))
        );
    });
}

export async function pushCsvToFirestore(filename: string, collectionName: string, rowToDoc: (row: any) => any,
    dryRun?: boolean) {
    const csvData = await readFromCSV(filename);
    const firestoreData = csvData.map((d: any) => rowToDoc(d));

    if (dryRun) {
        console.log('Dry run mode, no data will be pushed.');
        console.log(firestoreData);
        return;
    }

    const db = getFirestore();
    const targetCollection = collection(db, collectionName);
    return Promise.all(firestoreData.map((d: any) => addDoc(targetCollection, d)));
}