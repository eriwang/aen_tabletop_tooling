import { AttackType, Attribute, DamageType } from 'base_game_enums';
import { Weapon } from 'weapon';

describe('buildFromMap', () => {
    let weapMap : Map<string, any>;

    beforeEach(() => {
        weapMap = new Map<string, any>([
            ['Type', 'Strike'],
            ['Hit DC', 5],
            ['Damage Type', 'Slashing'],
            ['Primary Attribute', 'STR'],
            ['To Hit Multiplier', 1],
            ['Damage Multiplier', 2],
            ['Base Damage', 3]
        ]);
    });

    test('initializes correctly', () => {
        const weapon = Weapon.buildFromMap(weapMap);
        expect(weapon.attackType).toBe(AttackType.Strike);
        expect(weapon.difficultyClass).toBe(5);
        expect(weapon.damageType).toBe(DamageType.Slashing);
        expect(weapon.attribute).toBe(Attribute.Strength);
        expect(weapon.toHitMultiplier).toBe(1);
        expect(weapon.damageMultiplier).toBe(2);
        expect(weapon.baseDamage).toBe(3);
    });

    test('throws when attack type lookup fails', () => {
        weapMap.set('Type', 'N/A');
        expect(() => Weapon.buildFromMap(weapMap)).toThrowError();
    });

    test('throws when damage type lookup fails', () => {
        weapMap.set('Damage Type', 'N/A');
        expect(() => Weapon.buildFromMap(weapMap)).toThrowError();
    });

    test('throws when attribute lookup fails', () => {
        weapMap.set('Primary Attribute', 'N/A');
        expect(() => Weapon.buildFromMap(weapMap)).toThrowError();
    });

    test('throws when key not found', () => {
        weapMap.delete('Hit DC');
        expect(() => Weapon.buildFromMap(weapMap)).toThrowError();
    });
});