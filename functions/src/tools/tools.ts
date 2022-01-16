import * as fs from 'fs';
import * as stream from 'stream';
import * as util from 'util';

import { parse } from 'csv-parse';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

import { run } from 'tools/firestore_tool';

const pipeline = util.promisify(stream.pipeline);

async function readFromCSV(filename:string): Promise<any> {
    let results:any[] = [];
    const parser = parse({columns: true}, function(err, data) {
        results = (data);
    });

    await pipeline(
        fs.createReadStream(filename),parser
    );

    return results;
}

async function writeToDatabase(collection: string, data:any[]) {
    const db = getFirestore();
    let resultmap:Promise<void>[] = [];
    data.forEach((element:any) => {
        console.log(element.Name);
        resultmap.push(setDoc(doc(db, collection, element.Name),{
            Type: element.Type,
            Range: +element.Range,
            HitDC: +element['Hit DC'],
            DamageType: element['Damage Type'],
            Attribute: element['Primary Attribute'],
            BaseDamage: +element['Base Damage'],
            DamageMultiplier: +element['Damage Multiplier'],
            Cooldown: +element['Cooldown'],
            FPCost: +element['FP Cost'],
            Description: element['Description'],
            Category: element['Category']
        }));
    });

    console.log('waiting for ' + resultmap.length + ' promises');
    return Promise.all(resultmap);
}

async function writeDataFromCSV(filename:string) {
    const results = await readFromCSV(filename);
    console.log(results);
    await writeToDatabase('Abilities', results);
    console.log('done done');

}

run(async () => {
    await writeDataFromCSV('Abilities.csv');
});
