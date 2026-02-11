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

function userName() {
  const name = sessionStorage.getItem('name')
  const div = document.getElementById("username");
  div.textContent = "" + name;
}

export const getStatus = async function() {
  const email = sessionStorage.getItem("email")
  const firingType = sessionStorage.getItem("firingType")
  const snapshot = await getDocs(query(collection(db, firingType), where("email", "==", email)))
  snapshot.forEach((doc) => {
    const status = doc.data().status;
    if (status == "unfired") {
      const divVar2 = document.getElementById("centerbox");
      divVar2.textContent = "Your piece has been submitted!"
      
      //document.body.style.backgroundColor = "red"
    }
    if (status == "firing") {
      const divVar2 = document.getElementById("centerbox");
      divVar2.textContent = "Your piece is firing!";
      //document.body.style.backgroundColor = "red"
    }
    if (status == "fired") {
      document.body.style.backgroundColor = "green"
    }
  });
}
getStatus();
userName();
