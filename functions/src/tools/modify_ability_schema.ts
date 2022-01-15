import { collection, getDocs, setDoc, getFirestore } from 'firebase/firestore';

import { run } from 'tools/firestore_tool';

run(async () => {
    const db = getFirestore();

    const querySnapshot = await getDocs(collection(db, 'Abilities'));
    querySnapshot.forEach((doc) => {
        console.log(doc.id);
    });
});