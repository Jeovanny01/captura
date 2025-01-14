function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}


// Mostrar la sección de bienvenida por defecto cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    showSection('register');
});

let cameraStream = null;
const videoElement = document.getElementById("camera-preview");
const cameraContainer = document.getElementById("camera-container");
const inputCodigo = document.getElementById("codigo");

function iniciarEscaneo() {
    // Mostrar el contenedor de la cámara
    cameraContainer.style.display = "block";

    // Configurar y arrancar QuaggaJS
    Quagga.init({
        inputStream: {
            type: "LiveStream",
            target: videoElement, // Asignar el elemento del video
            constraints: {
                facingMode: "environment" // Usar cámara trasera si está disponible
            }
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader", "code_39_reader"] // Formatos de código de barras
        },
        locate: true, // Mejorar detección del área del código de barras
    }, (err) => {
        if (err) {
            console.error("Error al iniciar Quagga:", err);
            detenerEscaneo();
            alert("No se pudo acceder a la cámara. Por favor, verifica los permisos.");
            return;
        }
        console.log("QuaggaJS iniciado correctamente.");
        Quagga.start();
    });

    // Procesar resultados de detección
    Quagga.onDetected((result) => {
        if (result && result.codeResult && result.codeResult.code) {
            console.log("Código detectado:", result.codeResult.code);
            inputCodigo.value = result.codeResult.code;
            detenerEscaneo(); // Detener después de encontrar un código
        }
    });

    // Manejar errores de detección
    Quagga.onProcessed((result) => {
        if (result) {
            const drawingCanvas = Quagga.canvas.dom.overlay;
            const ctx = Quagga.canvas.ctx.overlay;

            if (result.boxes) {
                ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                result.boxes
                    .filter((box) => box !== result.box)
                    .forEach((box) => {
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, ctx, {
                            color: "green",
                            lineWidth: 2
                        });
                    });
            }
        }
    });
}

function detenerEscaneo() {
    // Detener QuaggaJS
    Quagga.stop();
    cameraStream = null;

    // Ocultar el contenedor de la cámara
    cameraContainer.style.display = "none";

    console.log("Escaneo detenido.");
}
