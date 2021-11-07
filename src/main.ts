import { calculateToHit, calculateDamage } from 'attack_calculator';
import { AttributeStats } from 'attribute_stats';
import { Skills } from 'base_game_enums';
import { Character } from 'character';
import { loadItem } from 'gsheets/loader';
import { Profile } from 'profile';
import { ResistanceStats } from 'resistance_stats';
import { getNonNull, arrayToMap } from 'utils';

function loadCharacter(characterName: string) : Character {
    // As of time of writing, profile does not impact damage calculations. This will change in the future
    const dummyProfile = new Profile({} as Record<Skills, number>, 0, 0, 0, '');

    const unitMap = loadItem('Units', characterName, true);
    const armorMap = loadItem('Armors', unitMap.get('Armor'), false);
    const weaponMap = loadItem('Weapons', unitMap.get('Weapons'), true);

    const attrStats = AttributeStats.buildFromMap(unitMap);
    const resStats = ResistanceStats.buildFromMap(armorMap);
    // TODO: weapon

    return new Character(attrStats, resStats, {} as Weapon, dummyProfile);
}

// @ts-ignore
global.calculateAttack = () => {
    const SHEET_NAME = 'TestAttackCalc';
    const sheet = getNonNull(SpreadsheetApp.getActive().getSheetByName(SHEET_NAME));
    const nameToRange = arrayToMap(sheet.getNamedRanges(), nr => nr.getName(), nr => nr.getRange());

    const roll = parseInt(getNonNull(nameToRange.get('roll')).getDisplayValue());
    const attackerName = getNonNull(nameToRange.get('attacker')).getDisplayValue();
    const defenderName = getNonNull(nameToRange.get('defender')).getDisplayValue();



    // load the attacker char
    Character.buildUsingSheet(attackerName,);

    // load the defender char

    // const attacker = getNonNull(nameToChar.get(attackerName));
    // const defender = getNonNull(nameToChar.get(defenderName));

    // const toHitResult = calculateToHit(roll, attacker, defender);
    // const damage = calculateDamage(attacker, defender);

    const toHitResult = {
        doesAttackHit: false,
        attackerToHit: 4,
        defenderEvade: 20,
    };
    const damage = 69;

    getNonNull(nameToRange.get('attackerToHit')).setValue(toHitResult.attackerToHit);
    getNonNull(nameToRange.get('defenderEvade')).setValue(toHitResult.defenderEvade);
    getNonNull(nameToRange.get('didHit')).setValue(toHitResult.doesAttackHit);
    getNonNull(nameToRange.get('damage')).setValue(damage);
};

// @ts-ignore
global.logLoading = () => {
    loadItem('Units', 'Ixar', true).forEach((v, k) => {
        console.log(`${k}: ${v}`);
    });

    console.log('');

    loadItem('Armors', 'Iron', false).forEach((v, k) => {
        console.log(`${k}: ${v}`);
    });
};