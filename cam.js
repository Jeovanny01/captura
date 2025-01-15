

const startScanButton = document.getElementById("start-scan");
const stopScanButton = document.getElementById("stop-scan");
const resultOutput = document.getElementById("result-output");

let html5QrCode;

startScanButton.addEventListener("click", () => {
    const qrCodeRegionId = "reader";
    html5QrCode = new Html5Qrcode(qrCodeRegionId);

    // Configuración para leer códigos de barras y QR
    const config = {
        fps: 10, // Cuadros por segundo
        qrbox: { width: 300, height: 300 }, // Tamaño del cuadro de escaneo
        formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128, // Códigos de barras
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.EAN_13,
        ],
    };

    // Iniciar el escáner
    Html5Qrcode.getCameras()
        .then((devices) => {
            if (devices && devices.length) {
                const cameraId = devices[0].id; // Selecciona la primera cámara
                html5QrCode
                    .start(
                        cameraId,
                        config,
                        (decodedText, decodedResult) => {
                            // Muestra el resultado
                            resultOutput.textContent = decodedText;
                            console.log("Resultado completo:", decodedResult);
                        }
                    )
                    .catch((err) => {
                        console.error("Error al iniciar el escáner:", err);
                    });
                stopScanButton.disabled = false;
                startScanButton.disabled = true;
            } else {
                alert("No se encontraron cámaras.");
            }
        })
        .catch((err) => {
            console.error("Error al obtener cámaras:", err);
        });
});

// Detener el escáner
stopScanButton.addEventListener("click", () => {
    html5QrCode
        .stop()
        .then(() => {
            console.log("Escáner detenido.");
        })
        .catch((err) => {
            console.error("Error al detener el escáner:", err);
        });
    stopScanButton.disabled = true;
    startScanButton.disabled = false;
});
