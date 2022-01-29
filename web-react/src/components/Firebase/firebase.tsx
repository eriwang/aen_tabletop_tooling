import { initializeApp } from 'firebase/app';
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updatePassword,
    signOut,
    User,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    DocumentReference,
    getDoc,
    DocumentData,
    getDocs,
    QuerySnapshot,
    updateDoc,
    DocumentSnapshot,
    onSnapshot
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions'

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
    auth; db; fn;
    constructor() {
        const firebaseApp = initializeApp(config);

        this.auth = getAuth(firebaseApp);
        this.db = getFirestore(firebaseApp);
        this.fn = getFunctions(firebaseApp);
    }

    // *** Auth API *** //

    doCreateUserWithEmailAndPassword = (email: string, password: string) =>
        createUserWithEmailAndPassword(this.auth, email, password);

    doSignInWithEmailAndPassword = (email: string, password: string) =>
        setPersistence(this.auth, browserLocalPersistence)
            .then(() => {return signInWithEmailAndPassword(this.auth, email, password)})
            .catch(error => console.error(error));

    doSignOut = () =>
        signOut(this.auth);

    doPasswordReset = (email: string) =>
        sendPasswordResetEmail(this.auth, email);

    doPasswordUpdate = (password: string) =>
        updatePassword(this.auth.currentUser!, password);

    onAuthStateChanged = (callback: (user: User | null) => any) =>
        onAuthStateChanged(this.auth, user => callback(user));

    // *** Firestore API *** //

    doSetDoc = (document: DocumentReference, data: any) => setDoc(document, data);

    // *** User API *** //

    user = (uid: string | undefined) => doc(collection(this.db, 'Users'), uid);

    users = () => collection(this.db, 'Users');

    setUserData = (uid: string | undefined, data: any) => setDoc(this.user(uid), data);

    updateUserData = (uid: string | undefined, data: any) => updateDoc(this.user(uid), data);

    getUserData = (uid: string | undefined) => {
        return new Promise<DocumentData | undefined>((resolve, reject) => {
            getDoc(this.user(uid))
                .then(snapshot => resolve(snapshot.data()))
                .catch(error => reject(error))
        })
    }

    // *** Character API *** //

    characters = () => collection(this.db, 'Characters');

    character = (id: string) => doc(collection(this.db, 'Characters'), id);

    getCharactersData = () => {
        return new Promise<QuerySnapshot<DocumentData> | undefined>((resolve, reject) => {
            getDocs(this.characters())
                .then(snapshot => resolve(snapshot))
                .catch(error => reject(error))
        })
    }

    getCharacterData = (id: string) => {
        return new Promise<DocumentData | undefined>((resolve, reject) => {
            getDoc(this.character(id))
                .then(snapshot => resolve(snapshot.data()))
                .catch(error => reject(error))
        })
    }

    updateCharacterData = (id: string, property: string, newValue: any) =>
        updateDoc(this.character(id), {[property]: isNaN(+newValue) ? newValue : +newValue});


    addCharacterListener = (id: string, callback: (doc: DocumentSnapshot<DocumentData>) => any) => {
        return onSnapshot(this.character(id), callback);
    }

    addCharactersListener = (callbacks: { [key: string]: (doc: DocumentSnapshot<DocumentData>) => any }) => {
        return onSnapshot(this.characters(), snapshot => {
            snapshot.docChanges().forEach(change => {
                if(callbacks[change.type]) {
                    callbacks[change.type](change.doc);
                }
            })
        })
    }

    // units = () => collection(this.db, 'Units');

    // units = () => {
    //     return new Promise<QuerySnapshot<DocumentData>>((resolve, reject) => {
    //         getDocs(collection(this.db, 'Units'))
    //             .then(snapshot => resolve(snapshot))
    //             .catch(error => reject(error))
    //     })
    // }

    // *** Cloud Functions API *** //

    calculateAttack = (attackerId: string, defenderId: string, weaponName: string, roll: number) => {
        return new Promise<any>((resolve, reject) => {
            httpsCallable(this.fn, 'calculateAttack')({
                attackerId: attackerId,
                defenderId: defenderId,
                attackName: weaponName,
                roll: roll
            })
                .then(result => {
                    resolve(result.data);
                })
                .catch(error => {
                    reject(error)
                })
        });
    }

    useAbility = (attackerId: string, abilityName: string) => {
        return new Promise<any>((resolve, reject) => {
            httpsCallable(this.fn, 'useAbility')({
                characterId: attackerId,
                abilityName: abilityName
            })
                .then(result => {
                    resolve(result.data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    }
}

export default Firebase;