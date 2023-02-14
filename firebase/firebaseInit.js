  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  const analytics = getAnalytics(app);