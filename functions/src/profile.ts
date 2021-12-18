import { Attribute } from 'base_game_enums';

export class Profile {
    attributeToStatDiff: Record<Attribute, number>;

    // skills: Record<Skills, number>;
    // level: number;
    // armor: string;

    constructor(attrToStatDiff: Record<Attribute, number>) {
        this.attributeToStatDiff = attrToStatDiff;
    }

    // getSkillBonus(skill: Skills): number {
    //     return this.skills[skill];
    // }
}