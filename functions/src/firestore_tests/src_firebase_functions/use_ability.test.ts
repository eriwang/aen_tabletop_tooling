import useAbility, { BEAR_CLAW_WEAPON_ID, BEAR_HIDE_ARMOR_ID } from 'src_firebase_functions/use_ability';

import * as admin from 'firebase-admin';
import fftest from 'firebase-functions-test';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';

import { AbilityData } from 'ability';
import { AbilityCategory, AttackType, Attribute, DamageType } from 'base_game_enums';
import { Character, CharacterData } from 'character';
import { getCharacterRepr } from 'tests/test_data';
import { characterClassLoader } from 'firestore_utils/data_loaders';
import { WeaponData } from 'weapon';
import { ArmorData } from 'armor';
import { ClassData } from 'class';
import { ProfileData } from 'profile';

let charCollection: admin.firestore.CollectionReference;
let testEnv: RulesTestEnvironment;

const useAbilityWrapped = fftest().wrap(useAbility);

beforeAll(async () => {
    admin.initializeApp();
    testEnv = await initializeTestEnvironment({});
    await testEnv.clearFirestore();
    charCollection = admin.firestore().collection('Characters');
});

describe('Validation', () => {
    test('Character does not exist', async () => {
        expect(() => useAbilityWrapped({characterId: 'DNE', abilityName: 'DNE'})).rejects.toThrow();
    });

    test('Ability does not exist', async () => {
        await charCollection.doc('char').set(getCharacterRepr());
        expect(() => useAbilityWrapped({characterId: 'char', abilityName: 'DNE'})).rejects.toThrow();
    });
});

describe('Abilities', () => {
    describe('Ursine Form', () => {
        function getCharacterReprWithUrsineForm() : CharacterData {
            const ursineForm: AbilityData = {
                name: 'Ursine Form',
                category: AbilityCategory.Passive,
                cooldown: 0,
                description: 'Don\'t worry about it',
                fpCost: 10,
                isAttack: false
            };

            const char = getCharacterRepr();
            char.abilities = [ursineForm];

            return char;
        }

        const bearClaw: WeaponData = {
            name: 'Bear Claw',
            attribute: Attribute.STR,
            attackType: AttackType.Strike,
            damageType: DamageType.Slashing,
            baseDamage: 8,
            toHitMultiplier: 1,
            damageMultiplier: 1,
            hitDC: 8,
            range: 0
        };

        const bearHide: ArmorData = {
            name: 'Bear Hide',
            resistanceToFlat: {
                Slashing: 1,
                Bludgeoning: 2,
                Piercing: 3,
                Fire: 4,
                Water: 5,
                Air: 6,
                Earth: 7,
                Poison: 8,
                Radiant: 9,
                Necrotic: 10,
                Psychic: 11,
            },
            resistanceToPercent: {
                Slashing: 10,
                Bludgeoning: 20,
                Piercing: 30,
                Fire: 40,
                Water: 50,
                Air: 60,
                Earth: 70,
                Poison: 80,
                Radiant: 90,
                Necrotic: 100,
                Psychic: 110,
            },
        };

        // TODO: need profile

        const druidClass: ClassData = {
            name: 'Druid',
            fpPerInt: 7,
            hpPerCon: 6,
        };

        beforeAll(async () => {
            await admin.firestore().collection('Armor').doc(BEAR_HIDE_ARMOR_ID).set(bearHide);
            await admin.firestore().collection('Classes').doc();
            await admin.firestore().collection('Weapons').doc(BEAR_CLAW_WEAPON_ID).set(bearClaw);
        });

        test('Change to Ursine Form', async () => {
            const origChar = new Character(getCharacterReprWithUrsineForm());
            await charCollection.doc('druid').set(origChar.data);

            await useAbilityWrapped({characterId: 'druid', abilityName: 'Ursine Form'});

            const bearChar = await characterClassLoader.loadSingle('druid');

            // Swapped CON/WIS and STR/INT
            expect(bearChar.getAttributeStat(Attribute.CON)).toBe(origChar.getAttributeStat(Attribute.WIS));
            expect(bearChar.getAttributeStat(Attribute.WIS)).toBe(origChar.getAttributeStat(Attribute.CON));
            expect(bearChar.getAttributeStat(Attribute.STR)).toBe(origChar.getAttributeStat(Attribute.INT));
            expect(bearChar.getAttributeStat(Attribute.INT)).toBe(origChar.getAttributeStat(Attribute.STR));

            // Weapons swapped out for bear claw
            expect(bearChar.data.weapons.length).toBe(1);
            expect(bearChar.data.weapons[0]).toStrictEqual(bearClaw);

            // Armor and resistances swapped out for Bear Hide
            expect(bearChar.data.armor).toBe('Bear Hide');
            expect(bearChar.getResistanceStat(DamageType.Bludgeoning))
                .toStrictEqual({
                    percent: bearHide.resistanceToPercent.Bludgeoning, flat: bearHide.resistanceToFlat.Bludgeoning
                });
            expect(bearChar.getResistanceStat(DamageType.Slashing))
                .toStrictEqual({
                    percent: bearHide.resistanceToPercent.Slashing, flat: bearHide.resistanceToFlat.Slashing
                });

            // Max HP is recalculated using new CON * hpPerCon, and current HP is adjusted

            // Max FP is recalculated using new
        });

        test('Change back to Human Form', async () => {
            const bearChar = new Character(getCharacterReprWithUrsineForm());
            bearChar.data.internalMetadata.abilitiesInUse = ['Ursine Form'];

            // HP TODO:
            // FP TODO:

            // Hack the other data to be something different: the important part is that it gets reset later
            bearChar.data.attributes.CON = 420;
            bearChar.data.attributes.WIS = 69;
            bearChar.data.weapons = [bearClaw];
            bearChar.data.resistanceToFlat.Bludgeoning = 1337;
            bearChar.data.resistanceToPercent.Bludgeoning = 1337;
        });
    });

});