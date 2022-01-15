import { collection, getDocs, setDoc, getFirestore } from 'firebase/firestore';

import { abilitySchema, AbilityData } from 'ability';
import { run } from 'tools/firestore_tool';

function setIfStringNonEmpty(abilityData: AbilityData, key: string, s: string) {
    if (s !== '') {
        (abilityData as any)[key] = s;
    }
}

function setIfNumNonZero(abilityData: AbilityData, key: string, n: number) {
    if (n !== 0) {
        (abilityData as any)[key] = n;
    }
}

run(async () => {
    const db = getFirestore();

    const querySnapshot = await getDocs(collection(db, 'Abilities'));
    const abilityData: AbilityData[] = [];
    querySnapshot.forEach((doc) => {
        const d = doc.data();
        const docAbilityData: AbilityData = {
            name: doc.id,
            category: d.Category,
            cooldown: d.Cooldown,
            description: d.Description,
            fpCost: d.FPCost,
        };

        setIfStringNonEmpty(docAbilityData, 'attribute', d.Attribute);
        setIfStringNonEmpty(docAbilityData, 'damageType', d.DamageType);
        setIfStringNonEmpty(docAbilityData, 'attackType', d.Type);
        setIfNumNonZero(docAbilityData, 'baseDamage', d.BaseDamage);
        setIfNumNonZero(docAbilityData, 'hitDC', d.HitDC);
        setIfNumNonZero(docAbilityData, 'range', d.Range);

        abilitySchema.validateSync(docAbilityData);
        abilityData.push(docAbilityData);
    });

    abilityData.forEach((d) => {
        console.log(d);
    });
});