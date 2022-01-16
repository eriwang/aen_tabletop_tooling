import { collection, getDocs, setDoc, getFirestore, doc } from 'firebase/firestore';

import { abilitySchema, AbilityData } from 'ability';
import { AbilityCategory } from 'base_game_enums';
import { run } from 'tools/firestore_tool';

function getCategory(category: string) : AbilityCategory {
    if (category.includes('Basic')) {
        return AbilityCategory.Basic;
    }
    if (category.includes('Passive')) {
        return AbilityCategory.Passive;
    }

    throw `Could not find a category in string ${category}`;
}

function getIsAttack(attackType: string) : boolean {
    switch (attackType) {
        case 'Strike':
        case 'Projectile':
        case 'Curse':
            return true;
        default:
            return false;
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
            category: getCategory(d.Category),
            cooldown: d.Cooldown,
            description: d.Description,
            fpCost: d.FPCost,
            isAttack: getIsAttack(d.Type),
        };

        if (getIsAttack(d.Type)) {
            docAbilityData.attribute = d.Attribute;
            docAbilityData.damageType = d.DamageType;
            docAbilityData.attackType = d.Type;
            docAbilityData.baseDamage = d.BaseDamage;
            docAbilityData.damageMultiplier = d.DamageMultiplier;
            docAbilityData.hitDC = d.HitDC;
            docAbilityData.range = d.Range;
        }

        abilitySchema.validateSync(docAbilityData);
        abilityData.push(docAbilityData);
    });

    await Promise.all(abilityData.map((d) => setDoc(doc(db, 'Abilities', d.name), d)));
});
