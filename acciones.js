function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}


// Mostrar la sección de bienvenida por defecto cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    showSection('register');
});
function iniciarEscaneo() {
    const cameraContainer = document.getElementById("camera-container");

    // Mostrar el contenedor de la cámara
    cameraContainer.style.display = "block";

    Quagga.init({
        inputStream: {
            type: "LiveStream",
            constraints: {
                facingMode: "environment" // Usar cámara trasera
            },
            target: document.querySelector("#camera-preview") // Video preview
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader"] // Tipos de códigos de barras
        }
    }, function (err) {
        if (err) {
            console.error("Error al iniciar Quagga:", err);
            detenerEscaneo();
            return;
        }
        console.log("Quagga iniciado correctamente");
        Quagga.start();
    });

    // Escuchar los resultados de escaneo
    Quagga.onDetected(function (result) {
        if (result?.codeResult?.code) {
            console.log("Código detectado:", result.codeResult.code);
            document.getElementById("codigo").value = result.codeResult.code; // Poner el código en el input
            detenerEscaneo(); // Detener el escaneo después de capturar un código
        }
    });
}

function detenerEscaneo() {
    Quagga.stop(); // Detener Quagga
    document.getElementById("camera-container").style.display = "none"; // Ocultar la cámara
}
