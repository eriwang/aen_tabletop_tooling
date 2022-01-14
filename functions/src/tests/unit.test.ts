import { Attribute } from 'base_game_enums';
import { Unit } from 'unit';
import { getUnitRepr } from 'tests/test_data';

test('getAttribute', () => {
    const unit = new Unit(getUnitRepr());
    expect(unit.getAttribute(Attribute.Constitution)).toBe(1);
    expect(unit.getAttribute(Attribute.Strength)).toBe(2);
    expect(unit.getAttribute(Attribute.Dexterity)).toBe(3);
    expect(unit.getAttribute(Attribute.Wisdom)).toBe(4);
    expect(unit.getAttribute(Attribute.Intelligence)).toBe(5);
    expect(unit.getAttribute(Attribute.Charisma)).toBe(6);
});
