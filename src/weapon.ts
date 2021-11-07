import { Attribute, AttackType, DamageType, getAttrFromAbbrev } from 'base_game_enums';
import { getNonNull } from 'utils';

export class Weapon {
    attribute: Attribute;
    attackType: AttackType;
    damageType: DamageType;
    baseDamage: number;
    toHitMultiplier: number;
    damageMultiplier: number;
    difficultyClass: number;

    constructor(
        attr: Attribute,
        atkType: AttackType,
        dmgType: DamageType,
        baseDmg: number,
        toHitMult: number,
        dmgMult: number,
        diffCls: number) {
        this.attribute = attr;
        this.attackType = atkType;
        this.damageType = dmgType;
        this.baseDamage = baseDmg;
        this.toHitMultiplier = toHitMult;
        this.damageMultiplier = dmgMult;
        this.difficultyClass = diffCls;
    }

    static buildFromMap(map: Map<string, any>) : Weapon {
        const attribute = getAttrFromAbbrev(getNonNull(map.get('Primary Attribute')));
        const atkType = getNonNull(AttackType[map.get('Type') as keyof typeof AttackType]);
        const dmgType = getNonNull(DamageType[map.get('Damage Type') as keyof typeof DamageType]);
        const baseDmg = getNonNull(map.get('Base Damage'));
        const toHitMult = getNonNull(map.get('To Hit Multiplier'));
        const dmgMult = getNonNull(map.get('Damage Multiplier'));
        const diffCls = getNonNull(map.get('Hit DC'));

        return new Weapon(attribute, atkType, dmgType, baseDmg, toHitMult, dmgMult, diffCls);
    }
}
