import { Attribute, EvasiveStatType, getAbbrevFromAttr } from 'base_game_enums';
import { enumerateEnumValues, getNonNull } from 'utils';

export class AttributeStats {
    attributeToStat: Record<Attribute, number>;

    constructor(attributeToStat: Record<Attribute, number>) {
        this.attributeToStat = attributeToStat;
    }

    static buildFromMap(map: Map<string, any>) : AttributeStats {
        const attributeToStat = {} as Record<Attribute, number>;
        for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
            attributeToStat[attribute] = getNonNull(map.get(getAbbrevFromAttr(attribute)));
        }

        return new AttributeStats(attributeToStat);
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