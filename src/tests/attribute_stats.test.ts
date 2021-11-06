import { AttributeStats } from 'attribute_stats';
import { Attribute } from 'base_game_enums';
import { enumerateEnumValues } from 'utils';

test('All stats initialized to 0 if none passed in', () => {
    const attributeStats = AttributeStats.buildAttributesDefault();
    
    for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
        expect(attributeStats.get(attribute)).toBe(0);
    }
});

test('All stats initialized to 10 for test unit', () => {
    const attributeStats = AttributeStats.buildAttributesUnit('test');
    
    for (const attribute of enumerateEnumValues<Attribute>(Attribute)) {
        expect(attributeStats.get(attribute)).toBe(10);
    }

});