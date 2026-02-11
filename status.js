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

function drawFileOnCanvas(file) {
  const reader = new FileReader(); // read file to data URL
  reader.onload = () => {
    const img = new Image();
    console.log(img);
    img.src = reader.result; // data URL
    img.style.width = "30vw";
    img.style.height = "auto";
    img.style.marginTop = "5%";
    const center = document.getElementById("centerbox")
    center.appendChild(img);
  }
  reader.readAsDataURL(file);
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
    
}

export const getStatus = async function() {
  const email = sessionStorage.getItem("email")
  const firingType = sessionStorage.getItem("firingType")
  const snapshot = await getDocs(query(collection(db, firingType), where("email", "==", email)))
  snapshot.forEach((doc) => {
    const status = doc.data().status
    if (status == "unfired") {
      const divVar2 = document.getElementById("centerbox")
      divVar2.textContent = "Your piece has been submitted."
    }
    if (status == "firing") {
      const divVar2 = document.getElementById("centerbox")
      divVar2.textContent = "Your piece is firing."
    }
    if (status == "fired") {
      document.body.style.backgroundColor = "green"
    }
    const img = doc.data().image
    drawFileOnCanvas(dataURLtoFile(img, "image.png"))
    sessionStorage.setItem("credentialed", false)
  })
}

userName();
getStatus();
