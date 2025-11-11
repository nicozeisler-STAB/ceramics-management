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

const video = document.querySelector(".video");
const cameraButton = document.querySelector(".camera");
const canvas = document.querySelector(".canvas");

//Reads the imputed file, and logs a preview of the base64 data URL
function submitPicture(e) {
    const input = e?.target ?? document.querySelector(".image-input");
    if (!input || !input.files || input.files.length === 0) {
        console.warn("No file selected");
        return;
    }

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const base64 = reader.result; 
        console.log("File data URL (preview):", base64.slice(0, 100)); // shows the first 100 characters of the data URL
        console.log("Full data URL length:", base64.length);
        
    };
    reader.readAsDataURL(file);
}

// this displays the camera feed on the screen
navigator.mediaDevices.getUserMedia({video: true})
.then(stream => {
    video.srcObject = stream;
    video.play();
})


cameraButton.addEventListener("click", () => {
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    let image_data_url = canvas.toDataURL("image/jpeg");
    canvas.toBlob((blob) => {
        if (!blob) {
            console.error("Failed to create image blob");
            return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `selfie-${Date.now()}.jpg`; 
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }, "image/jpeg", 0.95);

})
