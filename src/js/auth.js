import { initializeApp } from 'firebase/app';
import {
  AuthErrorCodes,
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

console.log(AuthErrorCodes);
const authBackDrop = document.querySelector('.auth__backdrop');
const authForm = document.querySelector('.auth__form');
const authInputs = document.querySelector('.auth__unputs');
const authButtonClose = document.querySelector('.auth__button__close');
const userNickname = document.querySelector('#user_name');
const userEmail = document.querySelector('#user_email');
const userPassword = document.querySelector('#user_password');

const btnLogin = document.querySelector('#btnLogin');
const btnSignup = document.querySelector('#btnSignup');
const btnLogout = document.querySelector('#btnLogout');
const linkSignUp = document.querySelector('.link__signup');
const linkSignIn = document.querySelector('.link__signin');

const messageLogin = document.querySelector('.message__login');
// export const lblAuthState = document.querySelector('#lblAuthState');

// export const divLoginError = document.querySelector('#divLoginError');
// export const lblLoginErrorMessage = document.querySelector(
//   '#lblLoginErrorMessage'
// );

const firebaseSettings = initializeApp({
  apiKey: 'AIzaSyCeohKwpW6233js3UPE5dhzJtQnOMgZfaI',
  authDomain: 'itsharks-books-project.firebaseapp.com',
  databaseURL: 'https://itsharks-books-project-default-rtdb.firebaseio.com',
  projectId: 'itsharks-books-project',
  storageBucket: 'itsharks-books-project.appspot.com',
  messagingSenderId: '560994919300',
  appId: '1:560994919300:web:10cdf4110616a9d01f33d1',
});
const auth = getAuth(firebaseSettings);
console.log(auth);
console.log(btnLogin.disabled);
console.log(userEmail.value);

class Accounts {
  static create(account) {
    fetch(
      'https://itsharks-books-project-default-rtdb.firebaseio.com/accounts.json',
      {
        method: 'POST',
        body: JSON.stringify(account),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then(response => response.json())
      .then(response => {
        console.log(response);
        account.id = response.nickname;
        return account;
      })
      .then(addToLocalStorage);
  }
}

function addToLocalStorage(account) {
  const all = getAccountFromLocaleStorage();
  all.push(account);
  localStorage.setItem('accounts', JSON.stringify(all));
}

function getAccountFromLocaleStorage() {
  return JSON.parse(localStorage.getItem('accounts') || '[]');
}

// Login using email/password
const loginEmailPassword = async e => {
  e.preventDefault();
  const loginEmail = userEmail.value.trim();
  const loginPassword = userPassword.value.trim();
  console.log(loginEmail);
  try {
    await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
  } catch (error) {
    console.log(`There was an error: ${error}`);
    showLoginError(error);
  }
};

const showLoginError = error => {
  if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
    alert('Wrong password. Try again.');
  } else {
    alert(`Error: ${error.message}`);
  }
};

const showLoginState = user => {
  console.log(
    // `You're logged in as ${user.displayName} (uid: ${user.uid}, email: ${user.email}) `
    `You're logged in as  email: ${user.email}) `
  );
  messageLogin.insertAdjacentHTML(
    'beforeend',
    `<p class="auth__true__notify">You're logged in as <span>${user.email}<span></p>`
  );
  // authInputs.innerHTML = '';
  // btnLogout.classList.toggle('btn-hidden');
  // btnLogin.classList.toggle('btn-hidden');
  // linkSignUp.classList.add('btn-hidden');
  hideButtons();
};

function hideButtons() {
  // btnLogout.style.display = 'none';
  // btnLogin.style.display = 'none';
  // linkSignUp.style.display = 'none';
  authForm.style.display = 'none';
  btnLogout.style.display = 'block';
}

linkSignIn.addEventListener('click', () => {
  btnLogin.style.display = '';
  btnSignup.style.display = 'none';
  linkSignUp.style.display = '';
  linkSignIn.style.display = 'none';
  userNickname.style.display = 'none';
  messageLogin.innerHTML = '';

  messageLogin.insertAdjacentHTML(
    'beforeend',
    `<p class="auth__false__notify">You're not logged in</p>`
  );
});

linkSignUp.addEventListener('click', () => {
  btnLogin.style.display = 'none';
  btnSignup.style.display = 'block';
  linkSignUp.style.display = 'none';
  linkSignIn.style.display = 'block';
  userNickname.style.display = 'block';
  messageLogin.innerHTML = '';
  messageLogin.insertAdjacentHTML(
    'beforeend',
    `<p class="auth__notify">You can SIGN UP on this website</p>`
  );
});

// Create new account using email/password
const createAccount = async event => {
  event.preventDefault();
  const nickname = userNickname.value.trim();
  const email = userEmail.value.trim();
  const password = userPassword.value.trim();
  userNickname.style.display = 'block';

  const account = {
    nickname: nickname,
    email: email,
  };

  // Accounts.create(account).then(() => {
  //   console.log('Hello');
  // });

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    Accounts.create(account);

    // console.log(res);
    // console.log(email);
  } catch (error) {
    console.log(`There was an error: ${error}`);
    showLoginError(error);
    console.log(showLoginError(error));
  }
};

btnSignup.addEventListener('click', createAccount);

//  const hideLoginError = () => {
//   divLoginError.style.display = 'none';
//   lblLoginErrorMessage.innerHTML = '';
// };

// hideLoginError();

// Monitor auth state
const monitorAuthState = async () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      messageLogin.innerHTML = '';

      console.log(user);
      console.log(auth);
      // showApp();
      showLoginState(user);
      // setTimeout(() => {
      //   authBackDrop.classList.add('is-hidden');
      // }, 10000);
      // hideLoginError();
      // hideLinkError();
    } else {
      messageLogin.innerHTML = '';
      messageLogin.insertAdjacentHTML(
        'beforeend',
        `<p class="auth__false__notify">You're not logged in</p>`
      );
      showLoginForm();
    }
  });
};

const showLoginForm = () => {
  authForm.style.display = 'block';
  btnLogout.style.display = 'none';
  userNickname.style.display = 'none';
  userEmail.value = '';
  userPassword.value = '';

  // btnLogout.classList.toggle('btn-hidden');

  // userEmail.style.display = 'block';
  // userPassword.style.display = 'block';
};

// Log out
const logout = async () => {
  await signOut(auth);
};

btnLogin.addEventListener('click', loginEmailPassword);
btnLogout.addEventListener('click', logout);
authButtonClose.addEventListener('click', () => {
  authBackDrop.classList.add('is-hidden');
});

monitorAuthState();
// console.log(auth);
