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
const inputCodigo = document.getElementById("codigo");

async function iniciarEscaneo() {
    try {
        // Mostrar el contenedor
        cameraContainer.style.display = "block";

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
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: selectedDeviceId, facingMode: "environment" }
        });

        // Mostrar el video en el elemento <video>
        videoElement.srcObject = cameraStream;
        videoElement.play();

        // Iniciar detección de código de barras
        detectarCodigoDeBarras();
    } catch (error) {
        console.error("Error al iniciar el escaneo:", error);
        alert("No se pudo acceder a la cámara. Verifica los permisos.");
    }
}

async function detectarCodigoDeBarras() {
    if (!("BarcodeDetector" in window)) {
        alert("Tu navegador no soporta la API BarcodeDetector.");
        detenerEscaneo();
        return;
    }

    const barcodeDetector = new BarcodeDetector({ formats: ["code_128", "ean_13", "ean_8"] });

    const detectar = async () => {
        try {
            const barcodes = await barcodeDetector.detect(videoElement);
            if (barcodes.length > 0) {
                // Capturar el primer código detectado
                const codigo = barcodes[0].rawValue;
                console.log("Código detectado:", codigo);

                // Asignar el código al input
                inputCodigo.value = codigo;

                // Detener el escaneo después de capturar el código
                detenerEscaneo();
            } else {
                // Seguir buscando
                requestAnimationFrame(detectar);
            }
        } catch (error) {
            console.error("Error al detectar el código:", error);
        }
    };

    detectar();
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
}
