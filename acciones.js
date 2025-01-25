
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}


const codigoInput = document.getElementById('codigo');
const internoCheckbox = document.getElementById('interno');
const boton1 = document.getElementById('start-scan');
const boton2 = document.getElementById('stop-scan');
internoCheckbox.addEventListener('change', () => {
    
    if (internoCheckbox.checked) {
        codigoInput.required = false; // Desactiva el atributo 'required'
        codigoInput.value = ''; // Limpia el valor del campo
        codigoInput.disabled = true; // Opcional: Desactiva el campo
        boton1.disabled = true; 
        boton2.disabled = true; 
    } else {
       // codigoInput.required = true; // Activa el atributo 'required'
        codigoInput.disabled = false; // Habilita el campo nuevamente
        boton1.disabled = false; 
        boton2.disabled = false; 
    }
});


// Mostrar la sección de bienvenida por defecto cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem("session") || "{}");

    if (!session.isLoggedIn) {
        window.location.href = "index.html";
        return;
    }
    
    showSection('register');
    cargarCategorias();
    fetchData();
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
            video: { deviceId: selectedDeviceId }
        });

        // Verificar si el flujo de cámara fue exitoso
        if (cameraStream) {
            console.log("Cámara accesada exitosamente", cameraStream);
            videoElement.srcObject = cameraStream;
            videoElement.play();
            // Crear una instancia del lector de códigos de ZXing
            
            codeReader = new ZXing.BrowserMultiFormatReader();
            detectarCodigoDeBarras();
        } else {
            throw new Error("No se pudo acceder al flujo de la cámara.");
        }
    } catch (error) {
        console.error("Error al iniciar el escaneo:", error);

        if (error instanceof DOMException) {
            console.error("Detalles del error:", error.message, error.name);
        }

        // Verificar el tipo de error
        if (error.name === "NotAllowedError") {
            alert("El navegador necesita permisos para acceder a la cámara. Por favor, otórgales permisos.");
        } else if (error.name === "NotFoundError") {
            alert("No se encontraron cámaras disponibles.");
        } else if (error.name === "NotReadableError") {
            alert("La cámara está siendo utilizada por otra aplicación.");
            //detenerEscaneo();
        } else if (error.name === "AbortError") {
            alert("El acceso a la cámara fue cancelado.");
           
        } else {
            alert("No se pudo acceder a la cámara. Verifica los permisos.");
        }

        // Ocultar el contenedor de la cámara
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




const inputArchivo = document.getElementById('archivo');
const btnQuitar = document.getElementById('btn-quitar');

// Mostrar el botón "Quitar" si se selecciona un archivo
inputArchivo.addEventListener('change', function () {
    if (this.files && this.files.length > 0) {
        btnQuitar.style.display = 'inline-block';
    }
});

// Quitar el archivo seleccionado
btnQuitar.addEventListener('click', function () {
    inputArchivo.value = ''; // Resetear el campo de archivo
    btnQuitar.style.display = 'none'; // Ocultar el botón
    DOC_DUI=null;
});

document.getElementById('formRegistrar').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    saveArticulo(); // Llama a la función para registrar al alumno
});

const btnEliminar = document.getElementById('btnEliminar');
btnEliminar.addEventListener('click', function () {
       deleteArticulo();

});




