function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}


// Mostrar la sección de bienvenida por defecto cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    showSection('register');
});

let isScanning = false;

function iniciarEscaneo() {
    const cameraContainer = document.getElementById("camera-container");
    const videoElement = document.getElementById("camera-preview");
    const inputCodigo = document.getElementById("codigo");

    // Mostrar el contenedor de la cámara
    cameraContainer.style.display = "block";

    if (!isScanning) {
        isScanning = true;

        Quagga.init({
            inputStream: {
                type: "LiveStream",
                target: videoElement, // Elemento <video> donde se muestra la cámara
                constraints: {
                    facingMode: "environment", // Usar cámara trasera
                },
                area: {
                    top: "25%",    // Margen superior
                    right: "25%",  // Margen derecho
                    bottom: "25%", // Margen inferior
                    left: "25%",   // Margen izquierdo
                },
            },
            decoder: {
                readers: ["code_128_reader", "ean_reader", "upc_reader"], // Tipos de códigos de barra soportados
            },
            locate: true, // Habilita la localización del código en el área definida
        }, function (err) {
            if (err) {
                console.error("Error al inicializar Quagga:", err);
                detenerEscaneo();
                return;
            }

            console.log("Quagga inicializado correctamente");
            Quagga.start();
        });

        // Evento para manejar el resultado del escaneo
        Quagga.onDetected(function (result) {
            const codigo = result.codeResult.code;
            console.log("Código detectado:", codigo);
            inputCodigo.value = codigo; // Mostrar el código en el input

            // Opcional: Notificar al usuario que el código fue detectado
            alert(`Código detectado: ${codigo}`);
        });
    }
}

function detenerEscaneo() {
    const cameraContainer = document.getElementById("camera-container");

    // Ocultar el contenedor de la cámara
    cameraContainer.style.display = "none";

    if (isScanning) {
        Quagga.stop(); // Detener el escaneo
        Quagga.offDetected(); // Desactivar eventos de detección
        isScanning = false;
        console.log("Escaneo detenido");
    }
}
