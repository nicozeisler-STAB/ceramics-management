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

export const addItem = async function() {
  const firingType = await document.getElementById("firingTypes").value
  const userSignature = await document.getElementById("signature").value
  const fileInput = await document.getElementById("image")
  const inArtShow = await document.getElementById("artShow")
  const image = fileInput.files[0]
  const imageString = await fileToBase64(image)
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

function fileToBase64(file, maxWidth = 800, maxHeight = 600, quality = 0.7) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const img = new Image();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        let width = img.width;
        let height = img.height;
        const widthRatio = maxWidth / width;
        const heightRatio = maxHeight / height;
        const ratio = Math.min(widthRatio, heightRatio, 1);
        width = width * ratio;
        height = height * ratio;
        canvas.width = width;
        canvas.height = height;
        context.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
