import { auth } from './firebase.js';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';

const tabs = [...document.querySelectorAll('[data-mode]')];
const forms = [...document.querySelectorAll('[data-form]')];
const title = document.querySelector('[data-title]');
const subtitle = document.querySelector('[data-subtitle]');
const switcher = document.querySelector('.auth-switch');
const toast = document.querySelector('[data-toast]');
const authForms = document.querySelector('[data-auth-forms]');
const accountCard = document.querySelector('[data-account-card]');

const copy = {
  login: ['Welcome back.', 'Sign in to revisit your ritual and order history.'],
  register: ['Create your account.', 'Save your ritual and return with ease.'],
};

const friendlyError = (error) => ({
  'auth/email-already-in-use': 'That email already has an account. Try signing in instead.',
  'auth/invalid-credential': 'The email or password is incorrect.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/missing-password': 'Please enter your password.',
  'auth/operation-not-allowed': 'Email sign-in still needs to be enabled in Firebase.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/weak-password': 'Use a stronger password with at least eight characters.',
}[error?.code] || 'We could not complete that request. Please try again.');

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('visible');
  window.setTimeout(() => toast.classList.remove('visible'), 3200);
};

const setBusy = (form, busy) => {
  const button = form.querySelector('.primary-button');
  button.disabled = busy;
  button.classList.toggle('is-busy', busy);
};

const setMode = (mode) => {
  tabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.mode === mode)));
  forms.forEach((form) => {
    const active = form.dataset.form === mode;
    form.hidden = !active;
    form.classList.toggle('active', active);
  });
  [title.textContent, subtitle.textContent] = copy[mode];
  switcher.style.setProperty('--switch', mode === 'register' ? '100%' : '0');
  history.replaceState(null, '', mode === 'register' ? '?mode=register' : './portal.html');
};

const validate = (form) => {
  form.querySelectorAll('.invalid').forEach((item) => item.classList.remove('invalid'));
  form.querySelectorAll('input').forEach((input) => {
    if (!input.checkValidity()) input.closest('.field, .check')?.classList.add('invalid');
  });
  const firstInvalid = form.querySelector(':invalid');
  if (!firstInvalid) return true;
  firstInvalid.focus();
  showToast('Please review the highlighted fields.');
  return false;
};

tabs.forEach((tab) => tab.addEventListener('click', () => setMode(tab.dataset.mode)));

document.querySelectorAll('[data-password-toggle]').forEach((button) => button.addEventListener('click', () => {
  const input = button.previousElementSibling;
  const visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  button.textContent = visible ? 'Show' : 'Hide';
  button.setAttribute('aria-label', `${visible ? 'Show' : 'Hide'} password`);
}));

forms.forEach((form) => form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!validate(form)) return;
  setBusy(form, true);

  const values = new FormData(form);
  const email = String(values.get('email')).trim();
  const password = String(values.get('password'));

  try {
    if (form.dataset.form === 'login') {
      await setPersistence(auth, values.get('remember') ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Welcome back. You are securely signed in.');
    } else {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const displayName = `${values.get('firstName')} ${values.get('lastName')}`.trim();
      await updateProfile(credential.user, { displayName });
      showToast('Your BENTHEG account is ready.');
    }
  } catch (error) {
    showToast(friendlyError(error));
  } finally {
    setBusy(form, false);
  }
}));

document.querySelector('[data-password-reset]').addEventListener('click', async () => {
  const email = document.querySelector('#login-form [name="email"]').value.trim();
  if (!email) {
    showToast('Enter your email first, then choose “Forgot password?”.');
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    showToast('Password reset email sent.');
  } catch (error) {
    showToast(friendlyError(error));
  }
});

document.querySelector('[data-sign-out]').addEventListener('click', async () => {
  await signOut(auth);
  showToast('You have been signed out.');
});

onAuthStateChanged(auth, (user) => {
  authForms.hidden = Boolean(user);
  accountCard.hidden = !user;
  if (user) document.querySelector('[data-account-email]').textContent = user.email;
});

setMode(new URLSearchParams(location.search).get('mode') === 'register' ? 'register' : 'login');
