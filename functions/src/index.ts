import * as admin from 'firebase-admin';

import calculateAttack from 'src_firebase_functions/calculate_attack';
import loadCharacter from 'src_firebase_functions/load_character';
import useAbility from 'src_firebase_functions/use_ability';

admin.initializeApp();

export { calculateAttack, loadCharacter, useAbility };
