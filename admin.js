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

export const showItems = async function(firingType){
  const column = document.getElementById('infoColumn')
  const snapshot = await getDocs(query(collection(db, firingType)))
  snapshot.forEach(item => {
    const info = item.data()
    const box = document.createElement('div')
    box.className = 'info-box'
    box.innerHTML = `
      <div class="info-title">${info.studentName}</div>
      <div class="info-detail">${info.signature}</div>
    `
    const startFiringButton = document.createElement("button")
    startFiringButton.innerHTML = "Start Firing"
    startFiringButton.onclick = async function() {
      await addDoc(collection(db, "firing"), {
          studentName: item.data().studentName,
          image: item.data().image,
          signature: item.data().signature,
          email: item.data().email,
          status: "firing"
      })
      await deleteDoc(doc(db, firingType, item.id))
      location.reload()
    }
    box.appendChild(startFiringButton)
    column.appendChild(box)
  });
}

export const showFirings = async function() {
  // Email to notify student when complete
  const column = document.getElementById('infoColumn')
  const snapshot = await getDocs(query(collection(db, "firing")))
  snapshot.forEach(item => {
    const info = item.data()
    const box = document.createElement('div')
    box.className = 'info-box'
    box.innerHTML = `
      <div class="info-title">${info.studentName}</div>
      <div class="info-detail">${info.signature}</div>
    `
    const completeButton = document.createElement("button")
    completeButton.innerHTML = "Mark Complete"
    completeButton.onclick = async function() {
      await deleteDoc(doc(db, "firing", item.id))
      location.reload()
    }
    box.appendChild(completeButton)
    column.appendChild(box)
  });
}

export const showArtShow = async function() {
  const column = document.getElementById("infoColumn")
  const snapshot = await getDocs(query(collection(db, "artShow")))
  snapshot.forEach(item => {
    const info = item.data()
    const box = document.createElement("div")
    box.className = "info-box"
    box.innerHTML = `
      <div class="info-title">${info.studentName}</div>
      <div class="info-detail">${info.signature}</div>
    `
  column.appendChild(box)
  });
}