import { Skills } from 'base_game_enums';
import { enumerateEnumValues } from 'utils';


export class Profile{
    skills: Record<Skills, number>;
    hpPerCon: number = 0;
    fpPerInt: number = 0;
    level: number = 0;
    armor: string = '';

    constructor(profileName: string){

        this.skills = {} as Record<Skills, number>;

        let sheet = SpreadsheetApp.getActive().getSheetByName('Profiles');
        if (sheet != null){
            let data = sheet.getDataRange().getValues();
            let row: number = -1;

            // find the row that matches the name
            for (let i = 0; i < data.length; i++){
                if (data[i][0] === name){
                    row = i;
                    break;
                }
            }

            if (row === -1){
                // Name not found
                return;
            }

            for (const skill of enumerateEnumValues<Skills>(Skills)){

                console.log(Skills[skill] + ' bonus: ' + data[row][skill + 1]);
                this.skills[skill] = data[row][skill + 1];

            }

            let hpConCol: number = 0;
            let fpIntCol: number = 0;
            let levelCol: number = 0;
            let armorCol: number = 0;

            for (let i = 0; i < data[0].length; i++){
                if (data[0][i] === 'HP/Con'){
                    hpConCol = i;
                }
                else if (data[0][i] === 'FP/Int'){
                    fpIntCol = i;
                }
                else if (data[0][i] === 'Level'){
                    levelCol = i;
                }
                else if (data[0][i] === 'Armor'){
                    armorCol = i;
                }
            }

            if (hpConCol == 0 || fpIntCol == 0 || levelCol == 0){
                console.log('Profile Columns could not be found');
                return;
            }

            this.hpPerCon = data[row][hpConCol];
            this.fpPerInt = data[row][fpIntCol];
            this.level = data[row][levelCol];
            this.armor = data[row][armorCol];

        }
    }

    getSkillBonus(skill: Skills): number{
        return this.skills[skill];
    }

}