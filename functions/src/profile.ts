import { Skills } from 'base_game_enums';

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

    getSkillBonus(skill: Skills): number {
        return this.skills[skill];
    }
}