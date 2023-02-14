import { db } from "../firebaseInit.js";

import {
    collection,
    addDoc,
    getDoc,
    onSnapshot,
    query
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";



const auth = getAuth();
let editor

$(document).ready(function () {

    allReviews()

    // loadVideos()

    onAuthStateChanged(auth, (user) => {
        if (user) {

            $("#userLogged").removeClass("d-none");
            $("#client").removeClass("d-none");
            ClassicEditor
                .create(document.querySelector('#editor'))
                .then(newEditor => {
                    editor = newEditor;
                })
                .catch(error => {
                    console.error(error);
                });

        } else {

            $("#userLogged").addClass("d-none");
            $("#client").addClass("d-none");


        }
    });




});





const loadVideos = () => {
    // console.log($("oembed[url]"));

    document.querySelectorAll("oembed[url]").forEach((element) => {
        // Create the <a href="..." class="embedly-card"></a> element that Embedly uses
        // to discover the media.
        const anchor = document.createElement("a");

        anchor.setAttribute("href", element.getAttribute("url"));
        anchor.className = "embedly-card";

        element.appendChild(anchor);
    });
}


$("#sendReview").click(async function () {


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


    const clientReview = {
        userid: auth.currentUser.uid,
        userDetails: userDetails,
        review: editor.getData(),
        date: time,
    };


    await addDoc(collection(db, "reviews"), clientReview);


    $("#alert").append(
        "<div class='alert success'><span class='closebtn'>&times;</span>Your Review Has Been Recorded!</div>"
    );


});




$("#signOutUser").click(function () {
    signOut(auth)
        .then(() => {

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

        });
});



const allReviews = () => {


    const q = query(collection(db, "reviews"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {

        let reviews = ``


        querySnapshot.forEach((doc) => {

            reviews = reviews + `<div class="testimonial-box">
            <div class="box-top">
            <div class="profile">
                <div class="profile-img">
                <img
                    src="https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png"
                />
                </div>
                <div class="name-user">
                <strong>`+ doc.data().userDetails.fullname + `</strong>
                <span>`+ (new Date(doc.data().date).toDateString()) + `</span>

                </div>
            </div>
            <div class="reviews">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="far fa-star"></i>
            </div>
            </div>

            <div class="client-comment">
            `+ doc.data().review + `
            </div>
        </div>`

        });

        $('#clientReviews').html(reviews)

    });



}
