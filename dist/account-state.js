import { auth } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';

onAuthStateChanged(auth, (user) => {
  document.querySelectorAll('[data-account-link]').forEach((link) => {
    link.textContent = user ? 'Account' : link.closest('.mobile-menu') ? 'Register account' : 'Register';
    link.href = user ? './portal.html' : './portal.html?mode=register';
  });
});
