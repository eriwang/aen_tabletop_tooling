import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const config = {
    apiKey: "AIzaSyCd2eL7UFFBQWVfizJZEVdD-3aP2IXPCRk",
    authDomain: "combat-tracker-3dd9d.firebaseapp.com",
    databaseURL: "https://combat-tracker-3dd9d-default-rtdb.firebaseio.com",
    projectId: "combat-tracker-3dd9d",
    storageBucket: "combat-tracker-3dd9d.appspot.com",
    messagingSenderId: "726783880260",
    appId: "1:726783880260:web:b28665ec1453987377a011",
    measurementId: "G-M9N1151GBT"
};

class Firebase {
    auth;
    constructor() {
        firebase.initializeApp(config);

        this.auth = firebase.auth();
    }

    // *** Auth API *** //

    doCreateUserWithEmailAndPassword = (email: string, password: string) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email: string, password: string) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () =>
        this.auth.signOut();

    doPasswordReset = (email: string) =>
        this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = (password: string) =>
        this.auth.currentUser?.updatePassword(password);
}

export default Firebase;