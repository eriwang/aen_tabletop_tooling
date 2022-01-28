import * as admin from 'firebase-admin';

import calculateAttack from 'src_firebase_functions/calculate_attack';
import useAbility from 'src_firebase_functions/use_ability';

admin.initializeApp();

export { calculateAttack, useAbility };
