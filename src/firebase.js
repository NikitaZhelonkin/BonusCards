import firebase from 'firebase/app';
import firebase_config from './firebase_config';

import 'firebase/auth';
import 'firebase/database';
import 'firebase/analytics';
import 'firebase/firestore';

firebase.initializeApp(firebase_config);
firebase.analytics();

export default firebase