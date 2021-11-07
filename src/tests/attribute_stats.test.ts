import { AttributeStats } from 'attribute_stats';
import { Attribute, EvasiveStatType } from 'base_game_enums';
import { enumerateEnumValues } from 'utils';

test('buildEmpty initializes stats to 0', () => {
    const attributeStats = AttributeStats.buildEmpty();
    for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
        expect(attributeStats.get(attribute)).toBe(0);
    }
});

test('getEvasiveStat uses correct attributes', () => {
    const attributeStats = new AttributeStats({
        [Attribute.Constitution]: 1,
        [Attribute.Strength]: 2,
        [Attribute.Dexterity]: 3,
        [Attribute.Wisdom]: 4,
        [Attribute.Intelligence]: 5,
        [Attribute.Charisma]: 6,
    });

    expect(attributeStats.getEvasiveStat(EvasiveStatType.Fortitude)).toBe(3);  // ceil(0.75 * (1 + 2))
    expect(attributeStats.getEvasiveStat(EvasiveStatType.Reflex)).toBe(6);  // ceil(0.75 * (3 + 4))
    expect(attributeStats.getEvasiveStat(EvasiveStatType.Willpower)).toBe(9);  // ceil(0.75 * (5 + 6))
});