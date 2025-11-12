import {initializeApp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {getFirestore, collection, addDoc} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCAOfNj92YHafyu2sAdYSSsAPf5RcxZ2wg",
  authDomain: "ceramicsstudio-deb67.firebaseapp.com",
  projectId: "ceramicsstudio-deb67",
  storageBucket: "ceramicsstudio-deb67.firebasestorage.app",
  messagingSenderId: "1089998700895",
  appId: "1:1089998700895:web:03a77d724f88b03b8736ea",
  measurementId: "G-Q1W9FR3Z8C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const addItem = async function() {
  const username = await document.getElementById("name").value
  const firingType = await document.getElementById("firingTypes").value
  const userSignature = await document.getElementById("signature").value
  const image = await document.getElementById("image").value
  const inartShow = await document.getElementById("artShow").value
  console.log(inartShow)
  if (inartShow == "yes") {
    await addDoc(collection(db, "artShow"), {
      studentName: username,
      image: "NA",
      signature: userSignature,
      email: sessionStorage.getItem("email"),
      status: "unfired",
    })
  }
  await addDoc(collection(db, firingType), {
    studentName: sessionStorage.getItem("name"),
    image: "NA",
    signature: userSignature,
    email: sessionStorage.getItem("email"),
    status: "unfired",
  })
  sessionStorage.setItem("firingType", firingType)
  window.location.href = "status.html"
}