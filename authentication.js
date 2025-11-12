import {initializeApp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {getFirestore, collection, addDoc, getDocs, query, where, doc} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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

export const login = async function() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const snapshot = await getDocs(query(collection(db, "accounts"), where("email", "==", email)))
    if (!snapshot.empty) {
        snapshot.forEach(doc => {
            if (password == doc.data().password) {
                if (email == "sbrodie@stab.org") {
                    window.location.href = "firstBisque.html"
                }
                else {
                    studentLogin(doc, email)
                }
            }
            else {
                alert("Invalid Password")
            }
            
        }); 
    }
    else {
        alert("Unrecognized email")
    }
}

async function studentLogin(doc, email) {
    const firingTypes = ["glaze", "firstBisque", "secondBisque"]
    for (const firingType of firingTypes) {
        const snapshot = await getDocs(query(collection(db, firingType), where("email", "==", email)))
        if (!snapshot.empty) {
            sessionStorage.setItem("email", email)
            sessionStorage.setItem("firingType", firingType)
            window.location.href = "status.html"
            return;
        }
    }
    sessionStorage.setItem("email", email)
    sessionStorage.setItem("name", doc.data().name)
    window.location.href = "form.html"
}

export const signup = async function() {
    const username = document.getElementById("name").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    await addDoc(collection(db, "accounts"), {
        name: username,
        email: email,
        password: password,
    })
    window.location.href = "index.html"
}
