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
    getDoc
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";



const auth = getAuth();


$(document).ready(() => {
    blogDetails(window.location.href.split("?")[1])

    onAuthStateChanged(auth, (user) => {
        if (user) {

            $("#userLogged").removeClass("d-none");

        } else {

            $("#userLogged").addClass("d-none");

        }
    });


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



const blogDetails = async (id) => {


    const docRef = doc(db, "blogs", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

        $("#blogHead").html(docSnap.data().headline)
        $("#blogDescription").html(docSnap.data().description)


    } else {

        $("#blogDescription").html("No Blogs To Display !")

    }


}