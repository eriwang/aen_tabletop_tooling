import { Attribute, getAbbrevFromAttr } from 'base_game_enums';
import { enumerateEnumValues, getNonNull } from 'utils';

export class Unit {
    attributeToStat: Record<Attribute, number>;q
    // hpPerCon: number;
    // fpPerInt: number;

    constructor(attributeToStat: Record<Attribute, number>) {
        this.attributeToStat = attributeToStat;
    }

    static buildFromMap(map: Map<string, any>) : Unit {
        const attributeToStat = {} as Record<Attribute, number>;
        for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
            attributeToStat[attribute] = getNonNull(map.get(getAbbrevFromAttr(attribute)));
        }

        return new Unit(attributeToStat);
    }

    get(attribute: Attribute) : number {
        return this.attributeToStat[attribute];
    }

    set(attribute: Attribute, value: number) {
        this.attributeToStat[attribute] = value;
    }
}