import {initializeApp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {getFirestore, collection, doc, getDocs, addDoc, updateDoc, query, where, deleteDoc} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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
  const firingType = await document.getElementById("firingType").value
  const signature = await document.getElementById("signature").value
  const image = await document.getElementById("image").value
  const docRef = await addDoc(collection(db, firingType), {
    studentName: username,
    image: image,
    signature: signature,
    email: sessionStorage.getItem("email"),
    status: "unfired"
  })
  sessionStorage.setItem("firingType", firingType)
  window.location.href = "status.html"
}