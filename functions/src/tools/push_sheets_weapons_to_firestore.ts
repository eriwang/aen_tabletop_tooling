import { run } from 'tools/firestore_tool';
import { pushCsvToFirestore } from './firestore_csv_pusher';
import { WeaponData, weaponSchema } from 'weapon';

function rowToDoc(row: any) : WeaponData {
    const [numDice, diceSize] = row['Base Damage'].split('d').map((n: any) => parseInt(n));
    const expectedBaseDamage = numDice * Math.round(diceSize / 2);
    const range = (row.Range === '-') ? 0 : parseInt(row.Range);

    const doc: WeaponData = {
        name: row.Name,
        attribute: row.Attribute,
        attackType: row['Attack Type'],
        damageType: row['Damage Type'],
        baseDamage: expectedBaseDamage,
        toHitMultiplier: 1,
        damageMultiplier: 1,
        hitDC: row['Hit DC'],
        range: range,
    };
    return weaponSchema.validateSync(doc);
}

run(async () => {
    await pushCsvToFirestore('Weapons - Sheet1.csv', 'Weapons', rowToDoc,
        /* isRealRun */ false, /* useNameAsId */ true);
});
