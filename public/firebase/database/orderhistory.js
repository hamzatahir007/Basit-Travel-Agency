import { db } from "../firebaseInit.js";


import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";


import { collection, query, where, getDocs, Timestamp, orderBy } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";


const auth = getAuth();






$(document).ready(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {

      $("#userLogged").removeClass("d-none");

      myOrders(user.uid);

    } else {

      $("#userLogged").addClass("d-none");

    }
  });


});



const myOrders = async (userId) => {

  const q = query(collection(db, "Order"), where("userid", "==", userId), orderBy("date", "desc"));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.size) {

    let orders = ``

    let i = 1

    querySnapshot.forEach((doc) => {


      orders = orders + `<tr>

    <td>`+ i + `</td>

    <td>`+ doc.id + `</td><td>`;

      doc.data().packageDetails.map(item => {

        // console.log(item);

        orders = orders + item.name + `(` + item.otherCategory + `) `;

      })

      // <td>`+ doc.data().packageDetails[1].name + `(` + doc.data().packageDetails[0].otherCategory + `)</td>
      // <td>`+ doc.data().packageDetails[2].name + `(` + doc.data().packageDetails[0].otherCategory + `)</td>`;


      orders = orders + `</td><td>` + new Date(doc.data().date).toLocaleDateString() + `</td>
    </tr>`

      i++

    });

    $('#orders').html(orders)

  } else {

    $("#orderTable").html('<h1>No Orders To Display.</h1>')

  }






}





