import { enumerateEnumValues } from 'utils';

export enum DamageType {
    Slashing,
    Bludgeoning,
    Piercing,
    Fire,
    Water,
    Air,
    Earth,
    Poison,
    Radiant,
    Necrotic,
    Psychic,
}

export interface ResistanceStat {
    percent: number;
    flat: number;
}

export class ResistanceStats {
    damageTypeToResistance: Record<DamageType, ResistanceStat>;

    constructor(damageTypeToNonZeroResistances?: Partial<Record<DamageType, ResistanceStat>>) {
        // Forced cast is because filling the object dynamically plays poorly with Record
        this.damageTypeToResistance = {} as Record<DamageType, ResistanceStat>;
        for (const damageType of enumerateEnumValues<DamageType>(DamageType)) {
            const nonZeroResistance = damageTypeToNonZeroResistances?.[damageType];
            this.damageTypeToResistance[damageType] =
                (nonZeroResistance === undefined) ? {percent: 0, flat: 0} : nonZeroResistance;
        }
    }

    get(damageType: DamageType) : ResistanceStat {
        return this.damageTypeToResistance[damageType];
    }

    set(damageType: DamageType, resistanceStat: ResistanceStat) {
        this.damageTypeToResistance[damageType] = resistanceStat;
    }
}