import { db } from "../firebaseInit.js";

import {
  collection,
  query,
  where,
  getDocs,
  limit,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

const auth = getAuth();


$(document).ready(() => {

  const packageid = window.location.href.split("?")[1];


  if (packageid.length > 0) {
    packageDetails(packageid);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        $("#userLogged").html(`<a class="nav-item mr-3">
          <button
            class="btn bg-danger text-white"
            style="border-radius: 25px"
            onclick="signOutUser()"
          >
            SignOut
          </button>
        </a>`);

        $("#session").addClass("d-none");
      } else {
        $("#userLogged").html(``);
        $("#session").removeClass("d-none");
      }
    });
  } else {
    window.location.href = "404.html";
  }
});

$("#proceed").click(function () {
  const packageid = window.location.href.split("?")[1];
  proceedBooking(packageid);
});

// FUNCTIONS

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

export const packageDetails = async (packageid) => {
  const q = query(collection(db, "product"), where("id", "==", packageid));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.docs.length) {
    querySnapshot.forEach((doc) => {
      $("#packageName").html(doc.data().name);

      $("#mainImage").html(`<img src="` + doc.data().image[0] + `" /> `);

      if (doc.data().discountPrice != "") {
        $("#totalPrice").html("Rs: " + doc.data().discountPrice);
      } else {
        $("#totalPrice").html("Rs: " + doc.data().rate);
      }

      $("#home").html(doc.data().description);

      $(".product-gallery").productGallery();

      $(".product-gallery").data("productGallery").addImages(doc.data().image);
    });
  }
};

const proceedBooking = async (packageid) => {
  let bookingData = localStorage.getItem("bookingData");
  let bookingDetails;

  if (auth.currentUser && bookingData) {
    let data = JSON.parse(bookingData);

    bookingDetails = {
      gender: data.gender,
      bookingDate: data.bookingDate,
      name: data.name,
      cnicNumber: data.cnicNumber,
      country: data.country,
      mobileNumber: data.mobileNumber,
      emailAddress: data.emailAddress,
      password: data.password,
      totalPrice: $("#totalPrice").text().split(" ")[1],
    };
  } else {
    bookingDetails = {
      gender: $("#details")[0].gender.value,
      bookingDate: $("#details")[0].bookingDate.value,
      name: $("#details")[0].name.value,
      cnicNumber: $("#details")[0].cnicNumber.value,
      country: $("#details")[0].country.value,
      mobileNumber: $("#details")[0].mobileNumber.value,
      emailAddress: $("#details")[0].emailAddress.value,
      password: $("#details")[0].userPass.value,
      totalPrice: $("#totalPrice").text().split(" ")[1],
    };
  }

  if (
    bookingDetails.gender &&
    bookingDetails.bookingDate &&
    bookingDetails.name &&
    bookingDetails.cnicNumber &&
    bookingDetails.country &&
    bookingDetails.mobileNumber &&
    bookingDetails.emailAddress &&
    bookingDetails.password
  ) {
    const mobileRegistered = query(
      collection(db, "userData"),
      where("phone", "==", bookingDetails.mobileNumber)
    );
    const registeredUser = await getDocs(mobileRegistered);

    if (registeredUser.docs.length) {
      localStorage.setItem("bookingData", JSON.stringify(bookingDetails));

      const q = query(collection(db, "product"), where("id", "==", packageid));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        localStorage.setItem("packageDetails", JSON.stringify(doc.data()));
      });

      window.location.href = "checkout.html";
      // alert("already Registered")
    } else {
      localStorage.setItem("bookingData", JSON.stringify(bookingDetails));

      const q = query(collection(db, "product"), where("id", "==", packageid));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        localStorage.setItem("packageDetails", JSON.stringify(doc.data()));
      });

      window.location.href = "checkout.html";
    }
  } else {
    $("#alert").html(
      "<div class='alert info'><span class='closebtn'>&times;</span>Empty Fields Detected!</div>"
    );
  }
};

