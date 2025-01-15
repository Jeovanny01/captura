const startScanButton = document.getElementById("start-scan");
const stopScanButton = document.getElementById("stop-scan");
const inputCodigo = document.getElementById("codigo");

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

    // Obtener las cámaras disponibles
    Html5Qrcode.getCameras()
        .then((devices) => {
            if (devices && devices.length) {
                // Intentar usar la cámara trasera primero
                let cameraId;
                const backCamera = devices.find(device => device.label.toLowerCase().includes("back"));

                if (backCamera) {
                    cameraId = backCamera.id; // Usar la cámara trasera si está disponible
                } else {
                    cameraId = devices[0].id; // Si no hay cámara trasera, usar la primera cámara disponible
                }

                // Iniciar el escáner
                html5QrCode
                    .start(
                        cameraId,
                        config,
                        (decodedText, decodedResult) => {
                            // Muestra el resultado
                            inputCodigo.value = decodedText;
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
