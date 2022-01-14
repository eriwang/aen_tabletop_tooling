import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import * as readlineSync from 'readline-sync';

import { getCharacterRepr } from 'tests/test_data';

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

initializeApp(firebaseConfig);

async function main() {
    const db = getFirestore();
    const charData = getCharacterRepr();

    const email = readlineSync.questionEMail('What is your DND email?\n');
    const password = readlineSync.question('What is your DND password?\n', {hideEchoBack: true});
    await signInWithEmailAndPassword(getAuth(), email, password);

    await setDoc(doc(db, 'Character', 'nevin_pls'), charData);

    console.log('Completed successfully, force killing because other packages have hanging connections.');
    process.exit(0);
}

main();