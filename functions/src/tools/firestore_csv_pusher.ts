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

export async function pushCsvToFirestore(filename: string, collectionName: string, rowToDoc: (row: any) => any) {
    const csvData = await readFromCSV(filename);

    const db = getFirestore();
    const targetCollection = collection(db, collectionName);
    return Promise.all(csvData.map((d: any) => addDoc(targetCollection, rowToDoc(d))));
}