import { Attribute, EvasiveStatType } from 'base_game_enums';
import { enumerateEnumValues } from 'utils';

export class AttributeStats {
    attributeToStat: Record<Attribute, number>;

    constructor() {
        this.attributeToStat = {} as Record<Attribute, number>;
    }

    buildAttributesDefault() {
        for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
            this.attributeToStat[attribute] = 0;
        }
    }

    buildAttributesUnit(name:string){
        var sheet = SpreadsheetApp.getActive().getSheetByName('Units');
        if(sheet != null){
            var data = sheet.getDataRange().getValues();
            let row: number = -1;

            //find the row that matches the name
            for( var i = 0; i<data.length; i++){
                if(data[i][0] === name){
                    row = i;
                    break;
                }
            }

            if(row === -1){
                //Name not found
                return;
            }


            for (const attribute of enumerateEnumValues<Attribute>(Attribute)){
                
                console.log(Attribute[attribute] + ": " + data[row][attribute+1]);
                this.attributeToStat[attribute] = data[row][attribute+1];

            }

        }
    }

    

    get(attribute: Attribute) : number {
        return this.attributeToStat[attribute];
    }

    set(attribute: Attribute, value: number) {
        this.attributeToStat[attribute] = value;
    }

    getEvasiveStat(evasiveStatType: EvasiveStatType) : number {
        let statSum: number;
        switch (evasiveStatType) {
            case EvasiveStatType.Fortitude:
                statSum = this.get(Attribute.Constitution) + this.get(Attribute.Strength);
                break;
            case EvasiveStatType.Reflex:
                statSum = this.get(Attribute.Dexterity) + this.get(Attribute.Wisdom);
                break;
            case EvasiveStatType.Willpower:
                statSum = this.get(Attribute.Intelligence) + this.get(Attribute.Charisma);
                break;

            default:
                throw `Unknown evasiveStatType ${evasiveStatType}`;
        }

        return Math.ceil(0.75 * statSum);
    }

}