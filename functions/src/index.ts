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

import calculateAttack from 'src_firebase_functions/calculate_attack';

admin.initializeApp();

export { calculateAttack };
