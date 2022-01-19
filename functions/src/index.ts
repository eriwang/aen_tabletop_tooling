import * as admin from 'firebase-admin';

import calculateAttack from 'src_firebase_functions/calculate_attack';

admin.initializeApp();

export { calculateAttack };
