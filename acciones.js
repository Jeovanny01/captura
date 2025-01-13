function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}


// Mostrar la sección de bienvenida por defecto cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    showSection('register');
});

let cameraStream;
const videoElement = document.getElementById("camera-preview");
const cameraContainer = document.getElementById("camera-container");

async function iniciarEscaneo() {
    try {
        // Mostrar el contenedor
        document.getElementById("camera-container").style.display = "block";

        // Obtener dispositivos de video
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");

        if (videoDevices.length === 0) {
            alert("No se encontraron cámaras en el dispositivo.");
            return;
        }

        // Usar la primera cámara disponible
        const selectedDeviceId = videoDevices[0].deviceId;

        // Configurar el flujo de video
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: selectedDeviceId, facingMode: "environment" }
        });

        // Mostrar el video en el elemento <video>
        const videoElement = document.getElementById("camera-preview");
        videoElement.srcObject = stream;
        videoElement.play();
    } catch (error) {
        console.error("Error al iniciar el escaneo:", error);
        alert("No se pudo acceder a la cámara. Verifica los permisos.");
    }
}


function detenerEscaneo() {
    // Detener la cámara
    if (cameraStream) {
        const tracks = cameraStream.getTracks();
        tracks.forEach(track => track.stop());
    }
    cameraContainer.style.display = "none";
}