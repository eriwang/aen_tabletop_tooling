import { Attribute } from 'base_game_enums';
import { Profile } from 'profile';

/*
describe('attributeBonuses', () => {
    const attributeBonuses : Record<Attribute, number> = {
        [Attribute.Constitution]: 1,
        [Attribute.Strength]: 2,
        [Attribute.Dexterity]: 3,
        [Attribute.Wisdom]: 4,
        [Attribute.Intelligence]: 5,
        [Attribute.Charisma]: 6,
    };

    //Update to use Profileschema/data
    test('works for multiple attribute types', () => {
        const profile = new Profile(1, attributeBonuses, {} as any as Armor);
        expect(profile.getAttributeDiff(Attribute.Strength)).toBe(2);
        expect(profile.getAttributeDiff(Attribute.Wisdom)).toBe(4);
        expect(profile.getAttributeDiff(Attribute.Intelligence)).toBe(5);
    });

    test('adds level', () => {
        const profile = new Profile(6, attributeBonuses, {} as any as Armor);
        expect(profile.getAttributeDiff(Attribute.Constitution)).toBe(6);  // 1 + 5
        expect(profile.getAttributeDiff(Attribute.Dexterity)).toBe(8);  // 3 + 5
        expect(profile.getAttributeDiff(Attribute.Charisma)).toBe(11);  // 6 + 5
    });
});*/
