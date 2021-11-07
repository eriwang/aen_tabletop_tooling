import { Skills } from 'base_game_enums';
import { enumerateEnumValues } from 'utils';


export class Profile {
    skills: Record<Skills, number>;
    hpPerCon: number;
    fpPerInt: number;
    level: number;
    armor: string;

    constructor(skills: Record<Skills, number>, hpPerCon: number, fpPerInt: number, level: number, armor: string) {
        this.skills = skills;
        this.hpPerCon = hpPerCon;
        this.fpPerInt = fpPerInt;
        this.level = level;
        this.armor = armor;
    }

    static buildFromSheet(profileName: string) : Profile {
        const skills = {} as Record<Skills, number>;

        let sheet = SpreadsheetApp.getActive().getSheetByName('Profiles');
        if (sheet != null) {
            let data = sheet.getDataRange().getValues();
            let row: number = -1;

            // find the row that matches the name
            for (let i = 0; i < data.length; i++) {
                if (data[i][0] === name) {
                    row = i;
                    break;
                }
            }

            if (row === -1) {
                // Name not found
                throw `Profile name ${profileName} not found`;
            }

            for (const skill of enumerateEnumValues<Skills>(Skills)) {
                console.log(Skills[skill] + ' bonus: ' + data[row][skill + 1]);
                skills[skill] = data[row][skill + 1];
            }

            let hpConCol: number = 0;
            let fpIntCol: number = 0;
            let levelCol: number = 0;
            let armorCol: number = 0;

            for (let i = 0; i < data[0].length; i++) {
                if (data[0][i] === 'HP/Con') {
                    hpConCol = i;
                }
                else if (data[0][i] === 'FP/Int') {
                    fpIntCol = i;
                }
                else if (data[0][i] === 'Level') {
                    levelCol = i;
                }
                else if (data[0][i] === 'Armor') {
                    armorCol = i;
                }
            }

            if (hpConCol == 0 || fpIntCol == 0 || levelCol == 0) {
                throw 'Profile Columns could not be found';
            }

            const hpPerCon = data[row][hpConCol];
            const fpPerInt = data[row][fpIntCol];
            const level = data[row][levelCol];
            const armor = data[row][armorCol];

            return new Profile(skills, hpPerCon, fpPerInt, level, armor);
        }

        throw 'Sheet not found, cannot build profile';
    }

    getSkillBonus(skill: Skills): number {
        return this.skills[skill];
    }

}