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
        // Mostrar el contenedor de la cámara
        cameraContainer.style.display = "block";

        // Verificar si BarcodeDetector está disponible
        if (!('BarcodeDetector' in window)) {
            alert("BarcodeDetector no es compatible con este navegador.");
            detenerEscaneo();
            return;
        }

        // Inicializar BarcodeDetector
        const barcodeDetector = new BarcodeDetector({ formats: ['code_128', 'ean_13', 'ean_8'] });

        // Iniciar la cámara
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        videoElement.srcObject = cameraStream;

        // Detectar códigos de barras en tiempo real
        const scan = async () => {
            try {
                const barcodes = await barcodeDetector.detect(videoElement);
                if (barcodes.length > 0) {
                    console.log("Código detectado:", barcodes[0].rawValue);
                    document.getElementById("codigo").value = barcodes[0].rawValue; // Poner el código en el input
                    detenerEscaneo(); // Detener el escaneo
                }
            } catch (error) {
                console.error("Error al detectar códigos:", error);
            }
            requestAnimationFrame(scan); // Continuar escaneando
        };
        scan(); // Iniciar escaneo
    } catch (error) {
        console.error("Error al iniciar el escaneo:", error);
        detenerEscaneo();
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