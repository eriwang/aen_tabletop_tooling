/*
Typically imports are done by writing relative paths (e.g. "./attack_calculator"). However, this project chooses to do
it based on adding "./src" list of paths looked at for imports. This plays poorly with Cloud Functions, which uses
Node's "require" function: "require" will only look for system libs or in node_modules if you don't provide a relative
or absolute path.
The ModuleAlias library hacks the "require" function to look in the specified path. We use __dirname because the
TypeScript transpiler will dump everything directly in the same directory.
 */
import ModuleAlias from 'module-alias';
ModuleAlias.addPath(__dirname);

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { Attack, calculateDamage, calculateToHit } from 'attack_calculator';
import { Character } from 'character';
import { Unit } from 'unit';
import { Attribute, DamageType } from 'base_game_enums';
import { Profile } from 'profile';
import { Armor, ResistanceStat } from 'armor';

export const calculateAttack = functions.https.onRequest((request, response) => {
    functions.logger.info('Beginning to calculate attack');

    // lol

    response.send(`${{damage: 5, toHit: 10}}}\ngoodbye`);
});

export const createCharacter = functions.https.onRequest((request, response) => {
    functions.logger.info('Beginning to create character');

    const attrToStat = {
        [Attribute.Constitution]: 1,
        [Attribute.Strength]: 2,
        [Attribute.Dexterity]: 3,
        [Attribute.Wisdom]: 4,
        [Attribute.Intelligence]: 5,
        [Attribute.Charisma]: 6,
    };

    const resStat : ResistanceStat = {percent: 0.25, flat: 10};
    const armor = new Armor({
        [DamageType.Slashing]: resStat,
        [DamageType.Bludgeoning]: resStat,
        [DamageType.Piercing]: resStat,
        [DamageType.Fire]: resStat,
        [DamageType.Water]: resStat,
        [DamageType.Air]: resStat,
        [DamageType.Earth]: resStat,
        [DamageType.Poison]: resStat,
        [DamageType.Radiant]: resStat,
        [DamageType.Necrotic]: resStat,
        [DamageType.Psychic]: resStat,
    });

    const unit = new Unit(attrToStat);
    const profile = new Profile(1, attrToStat, armor);

    const character = Character.build(unit, profile);

    response.send('done');
});