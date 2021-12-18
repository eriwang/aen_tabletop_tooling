import { Profile } from 'profile';
import { Attribute } from 'base_game_enums';
import { Armor } from 'armor';

describe('getAttributeStatDiff', () => {
    const attributeToStatDiff : Record<Attribute, number> = {
        [Attribute.Constitution]: 1,
        [Attribute.Strength]: 2,
        [Attribute.Dexterity]: 3,
        [Attribute.Wisdom]: 4,
        [Attribute.Intelligence]: 5,
        [Attribute.Charisma]: 6,
    };

    test('works for multiple attribute types', () => {
        const profile = new Profile(0, attributeToStatDiff, {} as any as Armor);
        expect(profile.getAttributeStatDiff(Attribute.Strength)).toBe(2);
        expect(profile.getAttributeStatDiff(Attribute.Wisdom)).toBe(4);
        expect(profile.getAttributeStatDiff(Attribute.Intelligence)).toBe(5);
    });

    test('adds level', () => {
        const profile = new Profile(5, attributeToStatDiff, {} as any as Armor);
        expect(profile.getAttributeStatDiff(Attribute.Constitution)).toBe(6);  // 1 + 5
        expect(profile.getAttributeStatDiff(Attribute.Dexterity)).toBe(8);  // 3 + 5
        expect(profile.getAttributeStatDiff(Attribute.Charisma)).toBe(11);  // 6 + 5
    });
});
