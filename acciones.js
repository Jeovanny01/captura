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

        // Intentar seleccionar una cámara trasera primero
        let selectedDeviceId = videoDevices[0].deviceId; // Predeterminado al primer dispositivo

        for (const device of videoDevices) {
            if (device.label.toLowerCase().includes("back") || device.label.toLowerCase().includes("trasera")) {
                selectedDeviceId = device.deviceId; // Usar cámara trasera si está disponible
                break;
            }
        }

        // Configurar el flujo de video
        const constraints = {
            video: {
                deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
                facingMode: "environment" // Intentar usar la cámara trasera
            }
        };

        // Intentar obtener acceso a la cámara
        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);

        // Mostrar el video en el elemento <video>
        videoElement.srcObject = cameraStream;
        videoElement.play();
    } catch (error) {
        console.error("Error al iniciar el escaneo:", error);

        // Manejo de errores
        if (error.name === "OverconstrainedError") {
            alert("No se pudo acceder a la cámara seleccionada. Intentando con otra cámara.");
            try {
                cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoElement.srcObject = cameraStream;
                videoElement.play();
            } catch (innerError) {
                console.error("Error al intentar usar otra cámara:", innerError);
                alert("No se pudo acceder a ninguna cámara.");
                cameraContainer.style.display = "none";
            }
        } else if (error.name === "NotAllowedError") {
            alert("El navegador necesita permisos para acceder a la cámara. Por favor, otórgalos.");
        } else if (error.name === "NotFoundError") {
            alert("No se encontraron cámaras disponibles.");
        } else {
            alert("Error desconocido al intentar acceder a la cámara.");
        }

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