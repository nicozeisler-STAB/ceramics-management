import {initializeApp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js"
import {getFirestore, collection, doc, getDocs, addDoc, query, orderBy, deleteDoc} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyCAOfNj92YHafyu2sAdYSSsAPf5RcxZ2wg",
  authDomain: "ceramicsstudio-deb67.firebaseapp.com",
  projectId: "ceramicsstudio-deb67",
  storageBucket: "ceramicsstudio-deb67.firebasestorage.app",
  messagingSenderId: "1089998700895",
  appId: "1:1089998700895:web:03a77d724f88b03b8736ea",
  measurementId: "G-Q1W9FR3Z8C"
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

/**
 * Queries firebase for all entries in a specified collection, converts the base64 data
 * to a url using a helper function, and then adds it to a target canvas. It also appends
 * a button with a function to reject the request (with a popup asking for a reason) and
 * a button to mark items as having started the firing process to move them to the firing queue
 * @author Nico Zeisler
 * @param {String} firingType - The firing type to display items of
 */
export const showItems = async function(firingType){  
  const column = document.getElementById("infoColumn")
  const snapshot = await getDocs(query(collection(db, firingType), orderBy("createdAt", "asc")))
  snapshot.forEach(item => {
    const filler = document.getElementById("filler")
    if (filler !== null) {
        filler.remove()
    }
    const info = item.data()
    const box = document.createElement("div")
    box.className = 'info-box'
    box.innerHTML = `
      <div class="info-title">${info.studentName}</div>
      <canvas class="placeHolderCanvas"></canvas>
      <div class="info-detail">${info.signature}</div>
    `
    drawFileOnCanvas(dataURLtoFile(info.image, "image.png"), box.querySelector("canvas")) 
    const startFiringButton = document.createElement("button")
    startFiringButton.innerHTML = "Start Firing"
    startFiringButton.onclick = async function() {
      await addDoc(collection(db, "firing"), {
          studentName: info.studentName,
          image: info.image,
          signature: info.signature,
          email: info.email,
          status: "firing"
      })
      await deleteDoc(doc(db, firingType, item.id))
      location.reload()
    }
    const rejectButton = document.createElement("button")
    rejectButton.innerHTML = "Reject Request"
    rejectButton.onclick = async function() {
      const reason = prompt("This piece was rejected because:", "") || "of unspecified reasons"
      await addDoc(collection(db, "rejected"), {
        text: "Your piece was rejected because " + reason + ". Please resubmit with changes",
        email: info.email,
      })
      await deleteDoc(doc(db, firingType, item.id))
      location.reload()
    }
    box.appendChild(startFiringButton)
    box.appendChild(rejectButton)
    column.appendChild(box)
  })
}

/**
 * Queries firebase for all entries in the currently firing collection, converts the base64 data
 * to a url using a helper function, and then adds it to a target canvas. It also appends
 * a button to mark items as having completed the firing process to delete them from the database
 * and send the user an email through our email service.
 * @author Nico Zeisler
 */
export const showFirings = async function() {
  const column = document.getElementById("infoColumn")
  const snapshot = await getDocs(query(collection(db, "firing")))
  snapshot.forEach(item => {
    const filler = document.getElementById("filler")
    if (filler !== null) {
        filler.remove()
    }
    const info = item.data()
    const box = document.createElement("div")
    box.className = 'info-box'
    box.innerHTML = `
      <div class="info-title">${info.studentName}</div>
      <canvas class="placeHolderCanvas"></canvas>
      <div class="info-detail">${info.signature}</div>
    `
    drawFileOnCanvas(dataURLtoFile(info.image, "image.png"), box.querySelector("canvas")) 
    const completeButton = document.createElement("button")
    completeButton.innerHTML = "Mark Complete"
    completeButton.onclick = async function() {
      const templateParams = {
        email: info.email,
        name: info.studentName
      }
      await emailjs.send("service_0ksgos9","template_4f2oqvu", templateParams)
      await deleteDoc(doc(db, "firing", item.id))
      location.reload()
    }
    box.appendChild(completeButton)
    column.appendChild(box)
  })
}

/**
 * Queries firebase for all entries in the currently artShow collection, converts the base64 data
 * to a url using a helper function, and then adds it to a target canvas. Also includes a remove
 * button in case the admin does not approve of the piece or it was submitted accidentally
 * @author Nico Zeisler
 */
export const showArtShow = async function() {
  const column = document.getElementById("infoColumn")
  const snapshot = await getDocs(query(collection(db, "artShow")))
  snapshot.forEach(item => {
    const filler = document.getElementById("filler")
    if (filler !== null) {
        filler.remove()
    }
    const info = item.data()
    const box = document.createElement("div")
    box.className = "info-box"
    box.innerHTML = `
      <div class="info-title">${info.studentName}</div>
      <canvas class="placeHolderCanvas"></canvas>
      <div class="info-detail">${info.signature}</div>
    `
    drawFileOnCanvas(dataURLtoFile(info.image, "image.png"), box.querySelector("canvas")) 
    const removeButton = document.createElement("button")
    removeButton.innerHTML = "Remove"
    removeButton.onclick = async function() {
      await deleteDoc(doc(db, "artShow", item.id))
      location.reload()
    }
    box.appendChild(removeButton)
    column.appendChild(box)
  })
}

/**
 * Draws the given file on the given target canvas scaled down to meet width and/or
 * height constraints.
 * @author Nico Zeisler
 * @param {File} file - The image file to extract data from
 * @param {HTMLCanvasElement} canvas - The target canvas to draw the image on
 */
function drawFileOnCanvas(file, canvas) {
  const ctx = canvas.getContext('2d')
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const maxW = 200
      const maxH = 150
      let w = img.naturalWidth
      let h = img.naturalHeight
      const scale = Math.min(1, maxW / w, maxH / h)
      w = Math.round(w * scale)
      h = Math.round(h * scale)
      canvas.width = w
      canvas.height = h
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(img, 0, 0, w, h)
    }
    img.src = reader.result
  }
  reader.readAsDataURL(file)
}

/**
 * Helper function to convert dataUrls from firebase into usable image files
 * @author Will Elias
 * @param {Sting} dataurl - String representation of the image file in base64
 * @param {String} filename - Name for the file to take upon creation
 * @returns {File} File contained within the data url
 */
function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
  while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}
