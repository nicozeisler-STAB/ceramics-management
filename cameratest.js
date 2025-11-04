const video = document.querySelector(".video")
const cameraButton = document.querySelector(".camera")
const canvas = document.querySelector(".canvas")

navigator.mediaDevices.getUserMedia({video: true})
.then(stream => {
    video.srcObject = stream;
    video.play();
})

cameraButton.addEventListener("click", () => {
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height)
    let image_data_url = canvas.toDataUrl("image/jpeg")


    const downloadLink = document.createElement("a")
    downloadLink.href = image_data_url
    downloadLink.download = "selfie.jpeg"
    document.body.appendChild(downloadLink)
    downloadLink.click();
    document.body.removeChild(downloadLink);
})