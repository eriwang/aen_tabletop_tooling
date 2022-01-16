import * as fs from 'fs';
import * as path from 'path';

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { UserImpl } from '@firebase/auth/internal';
import * as readlineSync from 'readline-sync';

import { getNonNull } from 'utils';

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

const firebaseTokenFile = path.resolve(__dirname + '/.firestore_tool_token.json');

async function signIn() {
    const email = readlineSync.questionEMail('What is your DND email?\n');
    const password = readlineSync.question('What is your DND password?\n', {hideEchoBack: true});
    await signInWithEmailAndPassword(getAuth(), email, password);

    console.log('Sign in successful, saving user data to disk.');
    const userData = JSON.stringify(getNonNull(getAuth().currentUser).toJSON());
    fs.writeFileSync(firebaseTokenFile, userData);
}

async function authUser() {
    if (!fs.existsSync(firebaseTokenFile)) {
        await signIn();
        return;
    }

    const userData = require(firebaseTokenFile);
    const user = UserImpl._fromJSON(getAuth() as any, userData);
    try {
        console.log('Attempting to sign in using saved token...');
        await getAuth().updateCurrentUser(user);
        console.log('Sign in successful.');
    }
    catch {
        console.log('Automatic sign in failed, falling back to email/password.');
        await signIn();
    }
}

export async function run(fn: () => Promise<any>) {
    await authUser();

    await fn();

    console.log('Completed successfully, force killing because other packages have hanging connections.');
    process.exit(0);
}