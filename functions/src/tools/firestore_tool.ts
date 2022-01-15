import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import * as readlineSync from 'readline-sync';

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

export async function run(fn: () => Promise<any>) {
    const email = readlineSync.questionEMail('What is your DND email?\n');
    const password = readlineSync.question('What is your DND password?\n', {hideEchoBack: true});
    await signInWithEmailAndPassword(getAuth(), email, password);

    await fn();

    console.log('Completed successfully, force killing because other packages have hanging connections.');
    process.exit(0);
}