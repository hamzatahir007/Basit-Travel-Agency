import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

import {
  doc,
  setDoc,
  Timestamp,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

import { db } from "../firebaseInit.js";

const auth = getAuth();

$(document).ready(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      $("#userLogged").removeClass("d-none");
      $("#userOrderHistory").removeClass("d-none");
    } else {
      $("#userLogged").addClass("d-none");
      $("#userOrderHistory").addClass("d-none");
    }
  });
});

$("#isUser").click(function () {
  isUser();
});

$("#userSignUp").keydown(function () {
  userSignUp(this.value);
});

$("#signOutUser").click(function () {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      $("#alert").append(
        "<div class='alert success'><span class='closebtn'>&times;</span>Successfuly Signed Out!</div>"
      );

      localStorage.clear();

      window.location.href = "index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      $("#alert").append(
        "<div class='alert danger'><span class='closebtn'>&times;</span>" +
        errorCode +
        "</div>"
      );

      // console.log(errorMessage);
      // An error happened.
    });
});

export const codeVerificationSent = () => {
  // const auth = getAuth();

  auth.useDeviceLanguage();

  window.recaptchaVerifier = new RecaptchaVerifier(
    "recaptcha-container",
    {},
    auth
  );

  const phoneNumber = JSON.parse(
    localStorage.getItem("bookingData")
  ).mobileNumber;

  const appVerifier = window.recaptchaVerifier;

  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      $("#recaptcha-container").append("");

      $("#codeInput").removeClass("d-none");

      window.confirmationResult = confirmationResult;

      return;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      window.recaptchaVerifier.render().then(function (widgetId) {
        grecaptcha.reset(widgetId);
      });
    });
};

export const userSignUp = (code) => {
  //verifcation of the code send to mobile number

  if (code.length == 6) {
    confirmationResult
      .confirm(code)
      .then((result) => {
        // User signed in successfully.
        $("#codeInput").addClass("d-none");

        const user = result.user;

        registerUser(user.uid);

        $("#alert").append(
          "<div class='alert success'><span class='closebtn'>&times;</span>Successfuly Signed In !</div>"
        );

        $("#codeInput").html(``);

        return;

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        $("#alert").append(
          "<div class='alert danger'><span class='closebtn'>&times;</span>" +
          errorCode +
          "</div>"
        );

        // User couldn't sign in (bad verification code?)
        // ...
      });
  }
};

export const registerUser = async (userid) => {
  //inserting user to database table userData
  const userBookingData = JSON.parse(localStorage.getItem("bookingData"));
  const packageDetails = JSON.parse(localStorage.getItem("packageDetails"));

  const time = new Date().getTime();

  const userDetails = {
    Gender: userBookingData.gender,
    email: userBookingData.emailAddress,
    fullname: userBookingData.name,
    password: userBookingData.password,
    phone: userBookingData.mobileNumber,
    cnic: userBookingData.cnicNumber,
    country: userBookingData.country,
  };

  await setDoc(doc(db, "userData", userid), userDetails);



  const orderData = {
    userid: auth.currentUser.uid,
    userDetails: userDetails,
    packageDetails: [packageDetails],
    date: time,
  };

  await addDoc(collection(db, "Order"), orderData);

  // await addDoc(collection(db, "adminRole"), {
  //   email: userDetails.email,
  //   password: userDetails.password,
  //   type: "user",
  // });
};

export const isUser = async () => {
  const userBookingData = JSON.parse(localStorage.getItem("bookingData"));
  const packageDetails = JSON.parse(localStorage.getItem("packageDetails"));

  const userDetails = {
    Gender: userBookingData.gender,
    email: userBookingData.emailAddress,
    fullname: userBookingData.name,
    password: userBookingData.password,
    phone: userBookingData.mobileNumber,
    cnic: userBookingData.cnicNumber,
    country: userBookingData.country,
  };

  if (auth.currentUser) {
    const time = new Date().getTime();

    const orderData = {
      userid: auth.currentUser.uid,
      userDetails: userDetails,
      packageDetails: [packageDetails],
      date: time,
    };

    await addDoc(collection(db, "Order"), orderData);

    $("#alert").append(
      "<div class='alert success'><span class='closebtn'>&times;</span>Your Order Is Booked!</div>"
    );
  } else {
    codeVerificationSent();
  }
};

// export { userSignup }
