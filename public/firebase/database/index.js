import { db } from "../firebaseInit.js";

import {
  collection,
  query,
  where,
  getDocs,
  limit,
  doc,
  setDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

const auth = getAuth();

let subtotals = "";

let subtotalone = "";
let subtotaltwo = "";
let subtotalthree = "";

let totalPrice = 0;

let totalone = 0;
let totaltwo = 0;
let totalthree = 0;

let customPackages = []

let packageOne = null
let packageTwo = null
let packageThree = null



$(document).ready(() => {
  categories();
  PopularTours();
  Blogs();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      $("#userLogged").removeClass("d-none");
      $("#userOrderHistory").removeClass("d-none")
      $("#session").addClass("d-none");
      // $("#userReviews").removeClass("d-none");


    } else {
      $("#userLogged").addClass("d-none");
      $("#userOrderHistory").addClass("d-none")
      $("#session").removeClass("d-none");
      // $("#userReviews").addClass("d-none");


    }
  });


});

$("#proceed").click(function () {

  isUser(this);

});


$("#userSignUp").keyup(function () {
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

        $("#alert").append("<div class='alert success'><span class='closebtn'>&times;</span>Order Booked !</div>")

        $("#codeInput").html(``);

        return;

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        $("#alert").html(
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
    packageDetails: customPackages,
    date: time,
  };

  await addDoc(collection(db, "Order"), orderData);

  await addDoc(collection(db, "adminRole"), {
    email: userDetails.email,
    password: userDetails.password,
    type: "user",
  });



};


export const isUser = async () => {

  customPackages = customPackages.filter(item => item != null)
  let bookingData = localStorage.getItem("bookingData");
  let userDetails;

  if (auth.currentUser && bookingData) {
    let data = JSON.parse(bookingData);

    userDetails = {
      gender: data.gender,
      bookingDate: data.bookingDate,
      name: data.name,
      cnicNumber: data.cnicNumber,
      country: data.country,
      mobileNumber: data.mobileNumber,
      emailAddress: data.emailAddress,
      password: data.password
    };
  } else {
    userDetails = {
      gender: $("#details")[0].gender.value,
      bookingDate: $("#details")[0].bookingDate.value,
      name: $("#details")[0].name.value,
      cnicNumber: $("#details")[0].cnicNumber.value,
      country: $("#details")[0].country.value,
      mobileNumber: $("#details")[0].mobileNumber.value,
      emailAddress: $("#details")[0].emailAddress.value,
      password: $("#details")[0].userPass.value,
    };

    localStorage.setItem("bookingData", JSON.stringify(userDetails))
  }

  if (auth.currentUser) {

    const time = new Date().getTime()


    const orderData = {

      userid: auth.currentUser.uid,
      userDetails: userDetails,
      packageDetails: customPackages,
      date: time

    }

    await addDoc(collection(db, "Order"), orderData);

    $("#alert").append("<div class='alert success'><span class='closebtn'>&times;</span>Your Order Is Booked!</div>");

  } else {

    codeVerificationSent()

  }
};



export const codeVerificationSent = () => {

  auth.useDeviceLanguage();

  // window.recaptchaVerifier = new RecaptchaVerifier(
  //   "recaptcha-container",
  //   {},
  //   auth
  // );


  window.recaptchaVerifier = new RecaptchaVerifier('proceed', {
    'size': 'invisible',
    'callback': (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      // onSignInSubmit();
    }
  }, auth);

  const phoneNumber = JSON.parse(
    localStorage.getItem("bookingData")
  ).mobileNumber;

  const appVerifier = window.recaptchaVerifier;


  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {

      $("#recaptcha-container").html("");

      $("#codeInput").removeClass("d-none");

      window.confirmationResult = confirmationResult;

      return;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      // window.recaptchaVerifier.render().then(function (widgetId) {
      //   grecaptcha.reset(widgetId);
      // });
    });
};


export const PopularTours = async () => {
  const querySnapshot = await getDocs(collection(db, "product"));

  let carouselData = `<div id="owl-carousel" class="owl-carousel owl-theme py-5">`;

  querySnapshot.forEach((doc) => {
    carouselData =
      carouselData +
      `<div class="item">
      <img
        class="object-cover"
        src="` +
      doc.data().image +
      `"
        alt=""
      />
      <div class="pt-2 p-3 bg-white" style="padding-bottom: 20px">`;

    if (doc.data().discountPercentage != "") {
      carouselData =
        carouselData +
        `<h2 class="text-black text-2xl font-bold">
          ` +
        doc.data().name +
        `
          <span class="float-right font-bold text-lg">PKR: ` +
        doc.data().discountPrice +
        `</span>
  
        </h2>
        <h3 class="float-right font-bold text-md" style="color:black;text-decoration: line-through;">PKR: ` +
        doc.data().rate +
        `</h3>`;
    } else {
      carouselData =
        carouselData +
        `<h2 class="text-black text-2xl font-bold">
          ` +
        doc.data().name +
        `
          <span class="float-right font-bold text-lg">PKR: ` +
        doc.data().rate +
        `</span>
  
        </h2>`;
    }

    carouselData =
      carouselData +
      `<div class="row p-5">
          <div class="flex-for-res">
            <div class="col-md-4 text-center">
              <img
                class="object-cover w-full"
                src="assets/img/jahaz.png"
                alt=""
              />
              <h3 class="text-md text-black">
                Flight <span class="font-bold">PKR:12,000</span>
              </h3>
            </div>
            <div class="col-md-4 text-center">
              <img
                class="object-cover w-full"
                src="assets/img/hotel.png"
                alt=""
              />
              <h3 class="text-md text-black">
                Hotel <span class="font-bold">PKR:10,000</span>
              </h3>
            </div>
            <div class="col-md-4 text-center">
              <img
                class="object-cover"
                style="width: 80% !important"
                src="assets/img/bat-ball.png"
                alt=""
              />
              <h3 class="text-md text-black">
                Trip <span class="font-bold">PKR:20,000</span>
              </h3>
            </div>
          </div>
  
        </div>
        <div class="py-3 text-center">
          <a href="hunza-tour.html?` +
      doc.id +
      `" class="bg-red-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"  >
            Book Now
          </a>
        </div>
      </div>
    </div>`;
  });

  carouselData = carouselData + `</div>`;

  $("#toursCarousel").html(carouselData);

  $("#owl-carousel").owlCarousel({
    loop: false,
    margin: 30,
    dots: false,
    nav: true,
    items: 2,
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 1,
        nav: false,
      },
      1000: {
        items: 2,
        nav: true,
        loop: true,
        margin: 20,
      },
    },
  });
};





export const Blogs = async () => {
  const querySnapshot = await getDocs(collection(db, "blogs"));

  let carouselData = `<div id="owl-carousel-1" class="owl-carousel owl-theme py-5">`;

  querySnapshot.forEach((doc) => {

    if (doc.data().image.length) {

      carouselData =
        carouselData +
        `<div class="item">
        <a href="blog.html?`+ doc.id + `">
        <img class="object-cover" src="`+ doc.data().image[0] + `" alt="" />
      <div class="pt-2 p-3" style="padding-bottom: 20px">
        <h2 class="text-black text-lg font-bold">
          `+ doc.data().headline + `
        </h2>
      </div>
        
        </a>
      
    </div>`;
    }

  });

  carouselData = carouselData + `</div>`;

  $("#blogsCarousel").html(carouselData);

  $("#owl-carousel-1").owlCarousel({
    loop: false,
    margin: 30,
    dots: false,
    nav: true,
    items: 2,
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 3,
        nav: false,
      },
      1000: {
        items: 3,
        nav: true,
        loop: true,
        margin: 20,
      },
    },
  });
};

const categories = async () => {
  const querySnapshot = query(collection(db, "MainCategory"), limit(3));

  const categories = await getDocs(querySnapshot);

  let arr = [];
  categories.forEach((doc) => {
    arr = arr.concat(doc.data());
  });

  customSelectOne(arr[2]);
  customSelectTwo(arr[1]);
  customSelectThree(arr[0]);
};

const customSelectOne = async (data) => {
  const q = query(
    collection(db, "product"),
    where("otherCategory", "==", data.category)
  );

  const querySnapshot = await getDocs(q);

  let selectOneData =
    `<select
    class="custom-select w-full"
    name="customSelectOne"
    id="customSelectOne"
    >
    <option selected="none" data-id='none'>Select your ` +
    data.category +
    `</option>`;

  if (querySnapshot.docs.length) {
    querySnapshot.forEach((doc) => {
      selectOneData =
        selectOneData +
        `<option value="` +
        doc.data().name.split(" ")[0] +
        `" data-id='` +
        JSON.stringify(doc.data()) +
        `' >` +
        doc.data().name +
        `</option>`;
    });
  } else {
    selectOneData =
      selectOneData + `<option selected="none">No Packages</option>`;
  }

  selectOneData =
    selectOneData +
    `</select>
    
    `;

  $("#customSelectOne").html(selectOneData);
};

$("#customSelectOne").change(function () {
  const selectedOptionData = $(this).find(":checked").data().id;


  if (selectedOptionData != "none") {
    subtotalone =
      `<div
    class="p-2 text-left mt-2"
    style="background-color: rgb(0, 0, 0)"
  >
    <h2 class="text-white text-lg">
      ` +
      selectedOptionData.name +
      `
      <span class="float-right text-md" id="totalPrice"
        >Rs: `;

    if (selectedOptionData.discountPrice != "") {
      totalone = parseInt(selectedOptionData.discountPrice);

      subtotalone = subtotalone + selectedOptionData.discountPrice;
    } else {
      totalone = parseInt(selectedOptionData.rate);

      subtotalone = subtotalone + selectedOptionData.rate;
    }

    subtotalone =
      subtotalone +
      `</span>
    </h2>
  </div>`;


    packageOne = selectedOptionData

  } else {
    subtotalone = "";
    totalone = 0;
    packageOne = null
  }


  customPackages = [packageOne, packageTwo, packageThree]




  subtotals = subtotalone + subtotaltwo + subtotalthree;

  totalPrice = totalone + totaltwo + totalthree;

  $("#subTotals").html(subtotals);

  $("#Total").html(
    `<div
    class="p-2 text-left mt-2"
    style="background-color: rgb(0, 0, 0)"
  >
    <h2 class="text-white text-lg">
      Total Price
      <span class="float-right text-md" id="totalPrice"
        >Rs: ` +
    totalPrice +
    `</span>
    </h2>
  </div>`
  );
});

const customSelectTwo = async (data) => {
  const q = query(
    collection(db, "product"),
    where("otherCategory", "==", data.category)
  );

  const querySnapshot = await getDocs(q);

  let selectTwoData =
    `<select
    class="custom-select w-full"
    name="customSelectTwo"
    id="customSelectTwo"
    >
    <option selected="none" data-id='none'>Select your ` +
    data.category +
    `</option>`;

  if (querySnapshot.docs.length) {
    querySnapshot.forEach((doc) => {
      selectTwoData =
        selectTwoData +
        `<option value="` +
        doc.data().name.split(" ")[0] +
        `" data-id='` +
        JSON.stringify(doc.data()) +
        `' >` +
        doc.data().name +
        `</option>`;
    });
  } else {
    selectTwoData =
      selectTwoData + `<option selected="none">No Packages</option>`;
  }

  selectTwoData =
    selectTwoData +
    `</select>
    
    `;

  $("#customSelectTwo").html(selectTwoData);
};

$("#customSelectTwo").change(function () {
  const selectedOptionData = $(this).find(":checked").data().id;

  if (selectedOptionData != "none") {
    subtotaltwo =
      `<div
    class="p-2 text-left mt-2"
    style="background-color: rgb(0, 0, 0)"
  >
    <h2 class="text-white text-lg">
      ` +
      selectedOptionData.name +
      `
      <span class="float-right text-md" id="totalPrice"
        >Rs: `;

    if (selectedOptionData.discountPrice != "") {
      subtotaltwo = subtotaltwo + selectedOptionData.discountPrice;

      totaltwo = parseInt(selectedOptionData.discountPrice);
    } else {
      subtotaltwo = subtotaltwo + selectedOptionData.rate;

      totaltwo = parseInt(selectedOptionData.rate);
    }

    subtotaltwo =
      subtotaltwo +
      `</span>
    </h2>
  </div>`;


    packageTwo = selectedOptionData
  } else {
    subtotaltwo = "";
    totaltwo = 0;
    packageTwo = null
  }

  subtotals = subtotalone + subtotaltwo + subtotalthree;

  totalPrice = totalone + totaltwo + totalthree;

  customPackages = [packageOne, packageTwo, packageThree]



  $("#subTotals").html(subtotals);

  $("#Total").html(
    `<div
    class="p-2 text-left mt-2"
    style="background-color: rgb(0, 0, 0)"
  >
    <h2 class="text-white text-lg">
      Total Price
      <span class="float-right text-md" id="totalPrice"
        >Rs: ` +
    totalPrice +
    `</span>
    </h2>
  </div>`
  );
});

const customSelectThree = async (data) => {
  const q = query(
    collection(db, "product"),
    where("otherCategory", "==", data.category)
  );

  const querySnapshot = await getDocs(q);

  let selectThreeData =
    `<select
    class="custom-select w-full"
    name="customSelectThree"
    id="customSelectThree"
    >
    <option selected="none" data-id="none">Select your ` +
    data.category +
    `</option>`;

  if (querySnapshot.docs.length) {
    querySnapshot.forEach((doc) => {
      selectThreeData =
        selectThreeData +
        `<option value="` +
        doc.data().name.split(" ")[0] +
        `" data-id='` +
        JSON.stringify(doc.data()) +
        `' >` +
        doc.data().name +
        `</option>`;
    });
  } else {
    selectThreeData =
      selectThreeData + `<option selected="none">No Packages</option>`;
  }

  selectThreeData =
    selectThreeData +
    `</select>
    
    `;

  $("#customSelectThree").html(selectThreeData);
};

$("#customSelectThree").change(function () {
  const selectedOptionData = $(this).find(":checked").data().id;

  if (selectedOptionData != "none") {
    subtotalthree =
      `<div
    class="p-2 text-left mt-2"
    style="background-color: rgb(0, 0, 0)"
  >
    <h2 class="text-white text-lg">
      ` +
      selectedOptionData.name +
      `
      <span class="float-right text-md" id="totalPrice"
        >Rs: `;

    if (selectedOptionData.discountPrice != "") {
      subtotalthree = subtotalthree + selectedOptionData.discountPrice;
      totalthree = parseInt(selectedOptionData.discountPrice);
    } else {
      subtotalthree = subtotalthree + selectedOptionData.rate;
      totalthree = parseInt(selectedOptionData.rate);
    }

    subtotalthree =
      subtotalthree +
      `</span>
    </h2>
  </div>`;
    packageThree = selectedOptionData

  } else {
    subtotalthree = "";
    totalthree = 0;
    packageThree = null
  }

  subtotals = subtotalone + subtotaltwo + subtotalthree;
  totalPrice = totalone + totaltwo + totalthree;
  customPackages = [packageOne, packageTwo, packageThree]


  $("#subTotals").html(subtotals);
  $("#Total").html(
    `<div
    class="p-2 text-left mt-2"
    style="background-color: rgb(0, 0, 0)"
  >
    <h2 class="text-white text-lg">
      Total Price
      <span class="float-right text-md" id="totalPrice"
        >Rs: ` +
    totalPrice +
    `</span>
    </h2>
  </div>`
  );
});
