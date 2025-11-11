
const video = document.querySelector(".video")
const cameraButton = document.querySelector(".camera");
const canvas = document.querySelector(".canvas");


function submitPicture(e) {
    const input = e?.target ?? document.querySelector(".image-input");
    if (!input || !input.files || input.files.length === 0) {
        console.warn("No file selected");
        return;
    }

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const base64 = reader.result; // data:image/..;base64,...
        console.log("File data URL (preview):", base64.slice(0, 100)); // show start of data URL
        console.log("Full data URL length:", base64.length);
        // send base64 to Firestore here...
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
    // Preferred: create a Blob and download (better memory & compatible)
    canvas.toBlob((blob) => {
        if (!blob) {
            console.error("Failed to create image blob");
            return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `selfie-${Date.now()}.jpg`; // change filename/extension as needed
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }, "image/jpeg", 0.95);

})
