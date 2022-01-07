import { Attribute, getAbbrevFromAttr } from 'base_game_enums';
import { enumerateEnumValues, getNonNull } from 'utils';

export class Unit {
    attributeToStat: Record<Attribute, number>;
    hpPerCon: number;
    fpPerInt: number;
    movement: number;

    constructor(attributeToStat: Record<Attribute, number>, hpPerCon: number, fpPerInt: number, movement: number) {
        this.attributeToStat = attributeToStat;
        this.hpPerCon = hpPerCon;
        this.fpPerInt = fpPerInt;
        this.movement = movement;
    }

    static buildFromMap(map: Map<string, any>) : Unit {
        const attributeToStat = {} as Record<Attribute, number>;
        for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
            attributeToStat[attribute] = getNonNull(map.get(getAbbrevFromAttr(attribute)));
        }

        // FIXME (if this function still ends up being used)
        return new Unit(attributeToStat, 0, 0, 0);
    }

    getAttribute(attribute: Attribute) : number {
        return this.attributeToStat[attribute];
    }
}