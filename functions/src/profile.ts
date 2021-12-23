import { Armor } from 'armor';
import { Attribute } from 'base_game_enums';

export class Profile {
    level: number;
    attributeToStatDiff: Record<Attribute, number>;
    armor: Armor;

    // skills: Record<Skills, number>;

    constructor(level: number, attrToStatDiff: Record<Attribute, number>, armor: Armor) {
        this.level = level;
        this.attributeToStatDiff = attrToStatDiff;
        this.armor = armor;
    }

    getAttributeStatDiff(attr: Attribute) : number {
        return this.attributeToStatDiff[attr] + this.level - 1;
    }

    getArmor() : Armor {
        return this.armor;
    }

    // getSkillBonus(skill: Skills): number {
    //     return this.skills[skill];
    // }
}