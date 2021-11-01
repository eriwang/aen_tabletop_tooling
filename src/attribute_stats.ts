import { Attribute, EvasiveStatType } from 'base_game_enums';
import { enumerateEnumValues } from 'utils';

export class AttributeStats {
    attributeToStat: Record<Attribute, number>;

    constructor() {
        this.attributeToStat = {} as Record<Attribute, number>;
        for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
            this.attributeToStat[attribute] = 0;
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