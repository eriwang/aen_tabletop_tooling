import {parse} from 'csv-parse';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

const util = require('util');
const stream = require('stream');

const pipeline = util.promisify(stream.pipeline);

const firebaseConfig = {
    apiKey: 'AIzaSyA1adK0Bz1j4Ba895Y54EHAYwNNo32BPDs',
    authDomain: 'combat-tracker-3dd9d.firebaseapp.com',
    databaseURL: 'https://combat-tracker-3dd9d-default-rtdb.firebaseio.com',
    projectId: 'combat-tracker-3dd9d',
    storageBucket: 'combat-tracker-3dd9d.appspot.com',
    messagingSenderId: '726783880260',
    appId: '1:726783880260:web:b28665ec1453987377a011',
    measurementId: 'G-M9N1151GBT'
};

// Initialize Firebase
initializeApp(firebaseConfig);

async function readFromCSV(filename:string): Promise<any> {
    const fs = require('fs');
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

writeDataFromCSV('Abilities.csv');