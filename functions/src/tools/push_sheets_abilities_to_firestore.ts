import { run } from 'tools/firestore_tool';
import { pushCsvToFirestore } from './firestore_csv_pusher';

function rowToDoc(row: any) : any {
    return {
        Type: row.Type,
        Range: +row.Range,
        HitDC: +row['Hit DC'],
        DamageType: row['Damage Type'],
        Attribute: row['Primary Attribute'],
        BaseDamage: +row['Base Damage'],
        DamageMultiplier: +row['Damage Multiplier'],
        Cooldown: +row['Cooldown'],
        FPCost: +row['FP Cost'],
        Description: row['Description'],
        Category: row['Category']
    };
}

run(async () => {
    await pushCsvToFirestore('Abilities.csv', 'TestAbilities', rowToDoc);
});
