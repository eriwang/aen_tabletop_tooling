import { Attribute, AttackType, DamageType } from 'base_game_enums';


// This is here for now since there's not much special about weapons (yet)
export class Weapon {
    attribute: Attribute;
    attackType: AttackType;
    damageType: DamageType;
    baseDamage: number;
    attributeMultiplier: number;
    difficultyClass: number;
    
    

    constructor(weapon: string){

        //Hardcode dagger
        this.attribute = Attribute.Dexterity;
        this.attackType = AttackType.Strike;
        this.damageType = DamageType.Piercing;
        this.baseDamage = 2;
        this.attributeMultiplier = .75;
        this.difficultyClass = 2;       

        /*var sheet = SpreadsheetApp.getActive().getSheetByName('Weapons');

        if(sheet != null){
            var data = sheet.getDataRange().getValues();
            let row: number = -1;

            //find the row that matches the name
            for( var i = 0; i<data.length; i++){
                if(data[i][0] === weapon){
                    row = i;
                    break;
                }
            }

            if(row === -1){
                //Name not found
                return;
            }

        }*/
    }
}