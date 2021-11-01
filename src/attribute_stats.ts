import { Attribute, EvasiveStatType } from 'base_game_enums';

export class AttributeStats {
    attributeToStat: Record<Attribute, number>;

    constructor({con, str, dex, wis, int, cha} : {
        con: number, str: number, dex: number, wis: number, int: number, cha: number
    }) {
        this.attributeToStat = {
            [Attribute.Constitution]: con,
            [Attribute.Strength]: str,
            [Attribute.Dexterity]: dex,
            [Attribute.Wisdom]: wis,
            [Attribute.Intelligence]: int,
            [Attribute.Charisma]: cha,
        };
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