import { calculateToHit, calculateDamage } from 'attack_calculator';
import { Character } from 'character';
import { loadItem } from 'gsheets/loader';
import { getNonNull, arrayToMap } from 'utils';

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