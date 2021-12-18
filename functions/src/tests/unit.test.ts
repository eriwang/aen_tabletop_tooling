import { Unit } from 'unit';
import { Attribute } from 'base_game_enums';

describe('buildFromMap', () => {
    test('initializes correctly', () => {
        const unit = Unit.buildFromMap(new Map<string, number>([
            ['CON', 1],
            ['STR', 2],
            ['DEX', 3],
            ['WIS', 4],
            ['INT', 5],
            ['CHAR', 6],
            ['N/A', 10]
        ]));

        expect(unit.get(Attribute.Constitution)).toBe(1);
        expect(unit.get(Attribute.Strength)).toBe(2);
        expect(unit.get(Attribute.Dexterity)).toBe(3);
        expect(unit.get(Attribute.Wisdom)).toBe(4);
        expect(unit.get(Attribute.Intelligence)).toBe(5);
        expect(unit.get(Attribute.Charisma)).toBe(6);
    });

    test('throws when attr not found', () => {
        expect(() => Unit.buildFromMap(new Map<string, number>([['CON', 1], ['STR', 2]]))).toThrowError();
    });
});
