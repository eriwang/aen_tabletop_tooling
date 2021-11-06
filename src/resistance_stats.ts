import { DamageType } from 'base_game_enums';
import { enumerateEnumValues } from 'utils';

export interface ResistanceStat {
    percent: number;
    flat: number;
}

export class ResistanceStats {
    damageTypeToResistance: Record<DamageType, ResistanceStat>;

    constructor(damageTypeToResistance: Record<DamageType, ResistanceStat>){
        this.damageTypeToResistance = damageTypeToResistance;     
    }

    static buildResistanceDefault() : ResistanceStats{

        const damageTypeToResistance = {} as Record<DamageType, ResistanceStat>;  

        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            damageTypeToResistance[damageType] = {percent: 0, flat: 0};
        }

        return new ResistanceStats(damageTypeToResistance);
    }

    static buildResistancesArmor(armor: string) : ResistanceStats{
        const damageTypeToResistance = {} as Record<DamageType, ResistanceStat>; 
        var sheet = SpreadsheetApp.getActive().getSheetByName('Armors');
        if(sheet != null){
            var data = sheet.getDataRange().getValues();
            let row: number = -1;

            //find the row that matches the name
            for( var i = 0; i<data.length; i++){
                if(data[i][0] === armor){
                    row = i;
                    break;
                }
            }

            if(row === -1){
                //Name not found
                throw('Name not found');
            }

            const damageTypes = enumerateEnumValues<DamageType>(DamageType);

            for (const damageType of damageTypes){
                //Currently there are 11 damageTypes, so I hardcoded a offset of 11
                //If there is a way to get the number of elements in an enum, let me know -Austin
                damageTypeToResistance[damageType] = {percent: data[row][damageType+1], flat: data[row][damageType+damageTypes.length+1]};

            }

        }

        return new ResistanceStats(damageTypeToResistance);

    }

    get(damageType: DamageType) : ResistanceStat {
        return this.damageTypeToResistance[damageType];
    }

    set(damageType: DamageType, resistanceStat: ResistanceStat) {
        this.damageTypeToResistance[damageType] = resistanceStat;
    }
}