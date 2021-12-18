import { AttributeStats } from 'attribute_stats';
import { Attribute } from 'base_game_enums';

describe('buildFromMap', () => {
    test('initializes correctly', () => {
        const attributeStats = AttributeStats.buildFromMap(new Map<string, number>([
            ['CON', 1],
            ['STR', 2],
            ['DEX', 3],
            ['WIS', 4],
            ['INT', 5],
            ['CHAR', 6],
            ['N/A', 10]
        ]));

        expect(attributeStats.get(Attribute.Constitution)).toBe(1);
        expect(attributeStats.get(Attribute.Strength)).toBe(2);
        expect(attributeStats.get(Attribute.Dexterity)).toBe(3);
        expect(attributeStats.get(Attribute.Wisdom)).toBe(4);
        expect(attributeStats.get(Attribute.Intelligence)).toBe(5);
        expect(attributeStats.get(Attribute.Charisma)).toBe(6);
    });

    test('throws when attr not found', () => {
        expect(() => AttributeStats.buildFromMap(new Map<string, number>([['CON', 1], ['STR', 2]]))).toThrowError();
    });
});
