import {initializeApp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {getFirestore, collection, addDoc, serverTimestamp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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

function fileTobase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    }
)};

export const addItem = async function() {
  const firingType = await document.getElementById("firingTypes").value
  const userSignature = await document.getElementById("signature").value
  const fileInput = await document.getElementById("image")
  const inArtShow = await document.getElementById("artShow")
  const image = fileInput.files[0]
  const imageString = await fileTobase64(image)
  if (inArtShow != null) {
    if (inArtShow.value == "yes") {
      await addDoc(collection(db, "artShow"), {
        studentName: sessionStorage.getItem("name"),
        image: imageString,
        signature: userSignature,
      })
    }
  }
  await addDoc(collection(db, firingType), {
    studentName: sessionStorage.getItem("name"),
    image: imageString,
    signature: userSignature,
    email: sessionStorage.getItem("email"),
    status: "unfired",
    createdAt: serverTimestamp()
  })
  sessionStorage.setItem("firingType", firingType)
  window.location.href = "status.html"
}

export const addArtShow = function() {
  if (document.getElementById("firingTypes").value == "glaze") {
    const artShowLabel = document.createElement("label")
    artShowLabel.innerHTML = "Would you like to submit your piece to the art show?"
    const artShowSelect = document.createElement("select")
    artShowSelect.id = "artShow"
    const no = document.createElement("option")
    no.value = "no"
    no.text = "No"
    artShowSelect.appendChild(no)
    const yes = document.createElement("option")
    yes.value = "yes"
    yes.text = "Yes"
    artShowSelect.appendChild(yes)  
    const container = document.getElementById("artShowContainer")
    container.appendChild(artShowLabel)
    container.appendChild(artShowSelect)
  }
}
