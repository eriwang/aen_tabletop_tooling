import { getFirestore, addDoc, collection } from 'firebase/firestore';

import { run } from 'tools/firestore_tool';
import { getCharacterRepr } from 'tests/test_data';

run(async () => {
    const db = getFirestore();
    const charData = getCharacterRepr();
    await addDoc(collection(db, 'Characters'), charData);
});