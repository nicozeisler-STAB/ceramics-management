import {initializeApp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {getFirestore, collection, doc, getDocs, addDoc, query, orderBy, deleteDoc} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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
  const column = document.getElementById("infoColumn")
  const snapshot = await getDocs(query(collection(db, firingType), orderBy("createdAt", "asc")))
  snapshot.forEach(item => {
    const info = item.data()
    const box = document.createElement("div")
    box.className = 'info-box'
    box.innerHTML = `
      <div class="info-title">${info.studentName}</div>
      <canvas class="placeHolderCanvas"></<div>
      <div class="info-detail">${info.signature}</div>
    `
    drawFileOnCanvas(dataURLtoFile(info.image, "image.png"), box.querySelector("canvas")) 
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
  const column = document.getElementById("infoColumn")
  const snapshot = await getDocs(query(collection(db, "firing")))
  snapshot.forEach(item => {
    const info = item.data()
    const box = document.createElement("div")
    box.className = 'info-box'
    box.innerHTML = `
      <div class="info-title">${info.studentName}</div>
      <canvas class="placeHolderCanvas"></<div>
      <div class="info-detail">${info.signature}</div>
    `
    drawFileOnCanvas(dataURLtoFile(info.image, "image.png"), box.querySelector("canvas")) 
    const completeButton = document.createElement("button")
    completeButton.innerHTML = "Mark Complete"
    completeButton.onclick = async function() {
      const templateParams = {
        email: info.email,
        name: info.studentName
      };
      await emailjs.send("service_0ksgos9","template_4f2oqvu", templateParams);
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
      <canvas class="placeHolderCanvas"></<div>
      <div class="info-detail">${info.signature}</div>
    `
    drawFileOnCanvas(dataURLtoFile(info.image, "image.png"), box.querySelector("canvas")) 
  column.appendChild(box)
  });
}

function drawFileOnCanvas(file, canvas) {
  const ctx = canvas.getContext('2d');
  const reader = new FileReader(); // read file to data URL
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      // set canvas size to fit image while limiting to max dimensions
      const maxW = 200; // change as needed
      const maxH = 150;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      const scale = Math.min(1, maxW / w, maxH / h);
      w = Math.round(w * scale);
      h = Math.round(h * scale);
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h); // draw image to canvas
    };
    img.src = reader.result; // data URL
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
