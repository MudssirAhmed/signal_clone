import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0X4Un4DiSHU6V1kNt7s6IyidMHnJMdOU",
  authDomain: "signal-clone-6900d.firebaseapp.com",
  projectId: "signal-clone-6900d",
  storageBucket: "signal-clone-6900d.appspot.com",
  messagingSenderId: "461097307953",
  appId: "1:461097307953:web:38800004130d1ab1c56a10",
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = app.auth();

export { auth, db };
