import { db } from "../firebaseInit.js";

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

const auth = getAuth();

$(document).ready(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      $("#userLogged").removeClass('d-none');
    } else {
      $("#userLogged").addClass('d-none');
    }
  });

  categories();
});


$("#signOutUser").click(function () {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      $("#alert").html(
        "<div class='alert success'><span class='closebtn'>&times;</span>Successfuly Signed Out!</div>"
      );

      localStorage.clear();

      window.location.href = "index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      $("#alert").html(
        "<div class='alert danger'><span class='closebtn'>&times;</span>" +
          errorCode +
          "</div>"
      );

      // console.log(errorMessage);
      // An error happened.
    });
});

const categories = async () => {
  const querySnapshot = query(collection(db, "MainCategory"), limit(3));

  const categories = await getDocs(querySnapshot);

  let arr = [];
  categories.forEach((doc) => {
    arr = arr.concat(doc.data());
  });

  PopularToursCategoryOne(arr[2]);
  PopularToursCategoryTwo(arr[1]);
  PopularToursCategoryThree(arr[0]);

};

export const PopularToursCategoryOne = async (data) => {

  const q = query(
    collection(db, "product"),
    where("otherCategory", "==", data.category)
  );

  const querySnapshot = await getDocs(q);

  $("#categoryNameOne").text(data.category)


  if (querySnapshot.docs.length) {

    let carouselData = `<div id="owl-carousel-1" class="owl-carousel owl-theme py-5">`;

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
      </div>
    `;
    });

    carouselData = carouselData + `</div>`;

    $("#toursCarouselOne").html(carouselData);
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
            items: 1,
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
  } else {

    $("#toursCarouselOne").html(`<h2 class="text-3xl text-black font-bold p-2 text-center">No Packages To Show</h2>`);
  }

  
};



export const PopularToursCategoryTwo = async (data) => {
    const q = query(
      collection(db, "product"),
      where("otherCategory", "==", data.category)
    );
  
    const querySnapshot = await getDocs(q);
  
    $("#categoryNameTwo").text(data.category)
  
  
    if (querySnapshot.docs.length) {
  
      let carouselData = `<div id="owl-carousel-2" class="owl-carousel owl-theme py-5">`;
  
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
        </div>
      `;
      });
  
      carouselData = carouselData + `</div>`;
  
      $("#toursCarouselTwo").html(carouselData);
      $("#owl-carousel-2").owlCarousel({
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
            items: 3,
            nav: true,
            loop: true,
            margin: 20,
          },
        },
      });
    } else {
      
      $("#toursCarouselTwo").html(`<h2 class="text-3xl text-black font-bold p-2 text-center">No Packages To Show</h2>`);
    }
  
    
  };



  export const PopularToursCategoryThree = async (data) => {
    const q = query(
      collection(db, "product"),
      where("otherCategory", "==", data.category)
    );
  
    const querySnapshot = await getDocs(q);
  
    $("#categoryNameThree").text(data.category)
  
  
    if (querySnapshot.docs.length) {
  
      let carouselData = `<div id="owl-carousel-3" class="owl-carousel owl-theme py-5">`;
  
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
        </div>
      `;
      });
  
      carouselData = carouselData + `</div>`;
  
      $("#toursCarouselThree").html(carouselData);
      $("#owl-carousel-3").owlCarousel({
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
            items: 3,
            nav: true,
            loop: true,
            margin: 20,
          },
        },
      });
    } else {
      
      $("#toursCarouselThree").html(`<h2 class="text-3xl text-black font-bold p-2 text-center">No Packages To Show</h2>`);
    }
  
    
  };