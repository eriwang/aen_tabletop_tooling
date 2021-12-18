import { Attribute } from 'base_game_enums';

export class Profile {
    level: number;
    attributeToStatDiff: Record<Attribute, number>;

    // skills: Record<Skills, number>;
    // level: number;
    // armor: string;

    constructor(level: number, attrToStatDiff: Record<Attribute, number>) {
        this.level = level;
        this.attributeToStatDiff = attrToStatDiff;
    }

    getAttributeStatDiff(attr: Attribute) : number {
        return this.attributeToStatDiff[attr] + this.level;
    }

    // getSkillBonus(skill: Skills): number {
    //     return this.skills[skill];
    // }
}