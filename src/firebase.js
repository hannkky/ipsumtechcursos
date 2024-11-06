import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC6o78I3UYxQfC6dTEgiak8gcx816eeztM",
  authDomain: "ipsumlearning-addf8.firebaseapp.com",
  projectId: "ipsumlearning-addf8",
  storageBucket: "ipsumlearning-addf8.appspot.com",
  messagingSenderId: "656294745176",
  appId: "1:656294745176:web:4cee9172dfc6a20657e62d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };