import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';



const firebaseConfig = {
  apiKey: "AIzaSyAZIkqeW_sHJHjXPZyCd_rGHvL1rV3_ZE4",
  authDomain: "travelagency-cf6b1.firebaseapp.com",
  projectId: "travelagency-cf6b1",
  storageBucket: "travelagency-cf6b1.appspot.com",
  messagingSenderId: "199032995329",
  appId: "1:199032995329:web:63c987c4b61977cf0d4a00",
  measurementId: "G-29D66XKRH7"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export { db };


