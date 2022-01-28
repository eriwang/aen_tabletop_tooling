import { WeaponData } from 'weapon';

interface DataLoader<Type> {
    loadSingle: (name: string) => Promise<Type>;
    loadMultiple: (names: string[]) => Promise<Type[]>;
}

export const weaponDataLoader: DataLoader<WeaponData> = {
    loadSingle: async (name: string) => {
        return {} as WeaponData;
    },

    loadMultiple: async (names: string[]) => {
        return [{}] as WeaponData[];
    },
};