import { armorSchema, ArmorData } from 'armor';
import { DamageType } from 'base_game_enums';
import { pushCsvToFirestore } from 'tools/firestore_csv_pusher';
import { run } from 'tools/firestore_tool';
import { enumerateEnumValues } from 'utils';

function rowToDoc(row: any) : ArmorData {
    const resistanceToFlatStat: any = {};
    const resistanceToPercentStat: any = {};
    for (const dt of enumerateEnumValues<DamageType>(DamageType)) {
        const dtStr = DamageType[dt];
        resistanceToFlatStat[dtStr] = row[dtStr];
        resistanceToPercentStat[dtStr] = 0;
    }

    const doc: ArmorData = {
        name: row.Name,
        resistanceToFlat: resistanceToFlatStat,
        resistanceToPercent: resistanceToPercentStat,
    };
    return armorSchema.validateSync(doc);
}

run(async () => {
    await pushCsvToFirestore('Armors - Player Armors.csv', 'Armors', rowToDoc);
});
