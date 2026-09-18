import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAsVhaUtSb6cMTIF9ufo3NHtuhSTgsL4-Q',
  authDomain: 'benjielipalam-5bef7.firebaseapp.com',
  projectId: 'benjielipalam-5bef7',
  storageBucket: 'benjielipalam-5bef7.firebasestorage.app',
  messagingSenderId: '878922182466',
  appId: '1:878922182466:web:3b49d8dac6b71e497c62db',
};

export const auth = getAuth(initializeApp(firebaseConfig));
