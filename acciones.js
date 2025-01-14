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
        // Mostrar el contenedor de la cámara
        cameraContainer.style.display = "block";

        // Obtener dispositivos de video
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");

        if (videoDevices.length === 0) {
            alert("No se encontraron cámaras en el dispositivo.");
            cameraContainer.style.display = "none";
            return;
        }

        // Seleccionar cámara trasera si está disponible
        let selectedDeviceId = videoDevices[0].deviceId;
        for (const device of videoDevices) {
            if (device.label.toLowerCase().includes("back") || device.label.toLowerCase().includes("trasera")) {
                selectedDeviceId = device.deviceId;
                break;
            }
        }

        // Configurar restricciones de video
        const constraints = {
            video: {
                deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
                facingMode: "environment",
                advanced: [{ focusMode: "continuous" }]
            }
        };

        // Iniciar flujo de video
        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = cameraStream;
        videoElement.play();

        // Configurar enfoque automático si es compatible
        const track = cameraStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        if (capabilities.focusMode && capabilities.focusMode.includes("continuous")) {
            await track.applyConstraints({ advanced: [{ focusMode: "continuous" }] });
        } else if (capabilities.focusDistance) {
            await track.applyConstraints({ advanced: [{ focusDistance: { ideal: 0.1 } }] }); // Ajustar para enfoque cercano
        }

        // Inicializar el lector de códigos de barras
        if (!codeReader) {
            codeReader = new ZXing.BrowserMultiFormatReader();
        }
        detectarCodigoDeBarras();
    } catch (error) {
        console.error("Error al iniciar el escaneo:", error);

        // Manejo de errores
        alert("Error al acceder a la cámara. Por favor, verifica los permisos o configura otra cámara.");
        detenerEscaneo();
    }
}

async function detectarCodigoDeBarras() {
    try {
        const result = await codeReader.decodeFromVideoElement(videoElement);
        if (result) {
            console.log("Código detectado:", result.text);
            inputCodigo.value = result.text;
            detenerEscaneo();
        }
    } catch (error) {
        console.error("Error al detectar el código:", error);
    } finally {
        // Continuar buscando
        if (cameraStream && codeReader) {
            requestAnimationFrame(detectarCodigoDeBarras);
        }
    }
}

function detenerEscaneo() {
    // Detener el flujo de la cámara
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    // Ocultar el contenedor de la cámara
    cameraContainer.style.display = "none";

    // Limpiar el lector de códigos de barras
    if (codeReader) {
        codeReader.reset();
    }
}
