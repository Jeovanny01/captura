function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}


// Mostrar la sección de bienvenida por defecto cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    showSection('register');
});

let isScanning = false;

let cameraStream;
const videoElement = document.getElementById("camera-preview");
const cameraContainer = document.getElementById("camera-container");
const inputCodigo = document.getElementById("codigo");

let codeReader;

async function iniciarEscaneo() {
    try {
        // Mostrar el contenedor
        cameraContainer.style.display = "block";

        // Obtener dispositivos de video
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");

        if (videoDevices.length === 0) {
            alert("No se encontraron cámaras en el dispositivo.");
            cameraContainer.style.display = "none";
            return;
        }

        // Usar la primera cámara disponible
        const selectedDeviceId = videoDevices[0].deviceId;

        // Intentar obtener acceso a la cámara
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: selectedDeviceId, facingMode: "environment" }
        });

        // Mostrar el video en el elemento <video>
        videoElement.srcObject = cameraStream;
        videoElement.play();

        // Crear una instancia del lector de códigos de ZXing
        codeReader = new ZXing.BrowserMultiFormatReader();
        
        // Iniciar detección de código de barras
        detectarCodigoDeBarras();
    } catch (error) {
        console.error("Error al iniciar el escaneo:", error);

        // Verificar si el error es de permisos
        if (error.name === "NotAllowedError" || error.name === "NotFoundError") {
            alert("El navegador necesita permisos para acceder a la cámara. Por favor, otórgales permisos.");
        } else {
            alert("No se pudo acceder a la cámara. Verifica los permisos.");
        }

        // Ocultar el contenedor de la cámara
        cameraContainer.style.display = "none";
    }
}

async function detectarCodigoDeBarras() {
    try {
        const result = await codeReader.decodeOnceFromVideoDevice(undefined, videoElement);
        if (result) {
            console.log("Código detectado:", result.text);
            inputCodigo.value = result.text;
            detenerEscaneo();
        }
    } catch (error) {
        console.error("Error al detectar el código:", error);
        requestAnimationFrame(detectarCodigoDeBarras); // Sigue buscando
    }
}

function detenerEscaneo() {
    // Detener la cámara
    if (cameraStream) {
        const tracks = cameraStream.getTracks();
        tracks.forEach(track => track.stop());
    }

    // Ocultar el contenedor de la cámara
    cameraContainer.style.display = "none";

    // Detener la reproducción del video
    videoElement.pause();
    videoElement.srcObject = null;

    // Detener el lector de ZXing
    if (codeReader) {
        codeReader.reset();
    }
} 