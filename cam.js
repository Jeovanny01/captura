const startScanButton = document.getElementById("start-scan");
const stopScanButton = document.getElementById("stop-scan");
const inputCodigo = document.getElementById("codigo");

let html5QrCode;
let codeReader;
let cameraStream;
const videoElement = document.getElementById("camera-preview");
const cameraContainer = document.getElementById("camera-container");

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

        // Intentar usar primero la cámara trasera
        let selectedDeviceId;
        const backCamera = videoDevices.find(device => device.label.toLowerCase().includes("back"));

        if (backCamera) {
            selectedDeviceId = backCamera.deviceId;
        } else {
            // Si no hay cámara trasera, usar la primera disponible
            selectedDeviceId = videoDevices[0].deviceId;
        }

        // Intentar obtener acceso a la cámara
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: selectedDeviceId, facingMode: { exact: "environment" } }
        });

        // Verificar si el flujo de cámara fue exitoso
        if (cameraStream) {
            console.log("Cámara accesada exitosamente", cameraStream);
            videoElement.srcObject = cameraStream;
            videoElement.play();

            // Usar el lector de ZXing para detección de códigos
            codeReader = new ZXing.BrowserMultiFormatReader();
            detectarCodigoDeBarras();
        } else {
            throw new Error("No se pudo acceder al flujo de la cámara.");
        }
    } catch (error) {
        console.error("Error al iniciar el escaneo:", error);

        // Manejo de errores según el tipo
        if (error.name === "NotAllowedError") {
            alert("El navegador necesita permisos para acceder a la cámara. Por favor, otórgales permisos.");
        } else if (error.name === "NotFoundError") {
            alert("No se encontraron cámaras disponibles.");
        } else if (error.name === "NotReadableError") {
            alert("La cámara está siendo utilizada por otra aplicación.");
        } else {
            alert("No se pudo acceder a la cámara. Verifica los permisos.");
        }

        // Ocultar el contenedor de la cámara en caso de error
        cameraContainer.style.display = "none";
    }
}

async function detectarCodigoDeBarras() {
    try {
        const result = await codeReader.decodeOnceFromVideoDevice(undefined, videoElement);
        if (result) {
            console.log("Código detectado:", result.text);
            inputCodigo.value = result.text;
            emitirPitido();
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

function emitirPitido() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine"; // Tipo de onda (senoidal para un tono básico)
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime); // Frecuencia en Hz (1000 es un tono típico)
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configuración de duración del pitido
    gainNode.gain.setValueAtTime(1, audioContext.currentTime); // Volumen inicial
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2); // Disminuye el volumen
    oscillator.start(audioContext.currentTime); // Inicia el sonido
    oscillator.stop(audioContext.currentTime + 0.2); // Detiene el sonido después de 0.2 segundos
}

// Botón de iniciar escaneo
startScanButton.addEventListener("click", iniciarEscaneo);

// Botón de detener escaneo
stopScanButton.addEventListener("click", () => {
    detenerEscaneo();
    stopScanButton.disabled = true;
    startScanButton.disabled = false;
});

// Mostrar sección de bienvenida por defecto cuando se carga la página
// document.addEventListener('DOMContentLoaded', () => {
//     showSection('register');
// });

// Función para mostrar la sección seleccionada
// function showSection(sectionId) {
//     document.querySelectorAll('section').forEach(section => section.style.display = 'none');
//     document.getElementById(sectionId).style.display = 'block';
// }
