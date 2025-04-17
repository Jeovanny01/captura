const startScanButton = document.getElementById("start-scan4");
const stopScanButton = document.getElementById("stop-scan4");
const inputCodigo = document.getElementById("codigo4");
const inputDescripcion = document.getElementById("descripcion4");
const inputItem = document.getElementById("item4");
const precio = document.getElementById("precio4");


let html5QrCode;
   // Detectar el ancho del dispositivo
   const screenWidth = window.innerWidth;
   const screenHeight = window.innerHeight;
   const qrboxSize = Math.min(screenWidth * 0.6, screenHeight * 0.6);

startScanButton.addEventListener("click", () => {
    const qrCodeRegionId = "reader4";
    html5QrCode = new Html5Qrcode(qrCodeRegionId);

    // Configuración para leer códigos de barras y QR
    const config = {
        fps: 10, // Cuadros por segundo
        qrbox: {  width: qrboxSize, height: qrboxSize * 0.67  }, // Cuadro de escaneo con tamaño fijo
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
      // Priorizar la cámara trasera si el dispositivo es iOS
 const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

 if (isIOS) {
     cameraId = devices[devices.length - 1].id; // Selecciona la última cámara (generalmente es la trasera en iOS)
 } else {
     const backCamera = devices.find(device => device.label.toLowerCase().includes("back"));
     cameraId = backCamera ? backCamera.id : devices[0].id; // Usa la cámara trasera si está disponible
 }

                // Iniciar el escáner
                html5QrCode
                    .start(
                        cameraId,
                        config,
                        (decodedText, decodedResult) => {
                            // Muestra el resultado
                            // Busca el producto en el arreglo
                            const productoEncontrado = buscarProducto(decodedText);

                            if (productoEncontrado) {
                                // Si el producto existe, detén el escáner y muestra un mensaje
                                detener(); // Detiene el escáner
                                inputCodigo.value = decodedText;
                                inputDescripcion.value = productoEncontrado.DESCRIPCION
                                inputItem.value = productoEncontrado.ITEM
                                precio.value= productoEncontrado.PRECIO_MAYOREO  || productoEncontrado.PRECIO ||  0
                               // alert(`Producto encontrado: ${productoEncontrado.ARTICULO}, NOMBRE: ${productoEncontrado.DESCRIPCION}`);
                                return; // Sale de la función para que no continúe
                            } 
                            
                                emitirPitido();
                            

                            inputCodigo.value = decodedText;
                            console.log("Resultado completo:", decodedResult);
                            setTimeout(() => {
                                detener();
                            }, 300);
                            
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
    detener();
});

function detener() {
    // Detener el escáner después de leer el código
    html5QrCode.stop()
    .then(() => {
        console.log("Escáner detenido automáticamente.");
        stopScanButton.disabled = true; // Deshabilitar el botón "Detener escaneo"
        startScanButton.disabled = false; // Habilitar el botón "Iniciar escaneo"
    })
    .catch((err) => {
        console.error("Error al detener el escáner automáticamente:", err);
    });
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