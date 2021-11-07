import { calculateToHit, calculateDamage } from 'attack_calculator';
import { AttributeStats } from 'attribute_stats';
import { Skills } from 'base_game_enums';
import { Character } from 'character';
import { loadItem } from 'gsheets/loader';
import { Profile } from 'profile';
import { ResistanceStats } from 'resistance_stats';
import { getNonNull, arrayToMap } from 'utils';
import { Weapon } from 'weapon';

function loadCharacter(characterName: string) : Character {
    // As of time of writing, profile does not impact damage calculations. This will change in the future
    const dummyProfile = new Profile({} as Record<Skills, number>, 0, 0, 0, '');

    const unitMap = loadItem('Units', characterName, true);
    const armorMap = loadItem('Armors', unitMap.get('Armor'), false);
    const weaponMap = loadItem('Weapons', unitMap.get('Weapons'), true);

    return new Character(
        AttributeStats.buildFromMap(unitMap),
        ResistanceStats.buildFromMap(armorMap),
        Weapon.buildFromMap(weaponMap),
        dummyProfile);
}

// @ts-ignore
global.calculateAttack = () => {
    const SHEET_NAME = 'TestAttackCalc';
    const sheet = getNonNull(SpreadsheetApp.getActive().getSheetByName(SHEET_NAME));
    const nameToRange = arrayToMap(sheet.getNamedRanges(), nr => nr.getName(), nr => nr.getRange());

    const roll = parseInt(getNonNull(nameToRange.get('roll')).getDisplayValue());
    const attackerName = getNonNull(nameToRange.get('attacker')).getDisplayValue();
    const defenderName = getNonNull(nameToRange.get('defender')).getDisplayValue();

    const attacker = loadCharacter(attackerName);
    const defender = loadCharacter(defenderName);

    const toHitResult = calculateToHit(roll, attacker, defender);
    const damage = calculateDamage(attacker, defender);

    getNonNull(nameToRange.get('attackerToHit')).setValue(toHitResult.attackerToHit);
    getNonNull(nameToRange.get('defenderEvade')).setValue(toHitResult.defenderEvade);
    getNonNull(nameToRange.get('didHit')).setValue(toHitResult.doesAttackHit);
    getNonNull(nameToRange.get('damage')).setValue(damage);
};
