
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
document.getElementById('sucursal').addEventListener('change', function() {
    localStorage.setItem("sucursal", this.value);
});

    // Obtener el elemento <select>
    const sucursalSelect = document.getElementById("sucursal4");

    // Agregar un evento para detectar cambios en el valor del select
    sucursalSelect.addEventListener("change", function() {
        ActualizaCortes();  // Ejecutar la función cuando cambia el valor
    });

// Mostrar la sección de bienvenida por defecto cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem("session") || "{}");

    if (!session.isLoggedIn) {
        window.location.href = "index.html";
        return;
    }
    document.getElementById("ff").setAttribute("value", new Date().toISOString().split('T')[0]);
    document.getElementById("ffCot").setAttribute("value", new Date().toISOString().split('T')[0]);
    document.getElementById("fiCot").value = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];


  // Ocultar por defecto
  document.getElementById("facturacion1").style.display = "none";
  document.getElementById("cierre1").style.display = "none";

    if (session.userRole === "1" ) {
        document.getElementById("facturacion1").style.display = "block";
        document.getElementById("cierre1").style.display = "block";
    } 

    if (empresa==="FARMA") showSection('inventario');
    if (empresa==="FUNNY") showSection('ventas');
    if (empresa==="DISPROSAL") showSection('ventas');
    if (empresa==="MMAG") showSection('inventario');
    localStorage.setItem("ventana", "venta1")
   // localStorage.removeItem("pedidoTabla2")
    pedidoTabla =  JSON.parse(localStorage.getItem("pedidoTabla") || ["{}"]);
    pedidoTabla2 =  JSON.parse(localStorage.getItem("pedidoTabla2") || "{}");
    pedidoTabla3 =  JSON.parse(localStorage.getItem("pedidoTabla3") || "{}");
    sucursalTabla =  JSON.parse(localStorage.getItem("sucursalTabla") || "{}");
    categoriaTabla =  JSON.parse(localStorage.getItem("categoriaTabla") || "{}");
    clienteTabla =  JSON.parse(localStorage.getItem("categoriaTabla") || "{}");
    
    try {
    if (pedidoTabla.length > 0) {
        // Si hay datos, recuperar y procesar la tabla
        recuperarTabla(pedidoTabla);
        document.getElementById("btnGuardarPedido").style.display = "flex";
        document.getElementById("btnCancelarPedido").style.display = "flex";
    } else {
        // Si no hay datos, inicializar pedidoTabla como un arreglo vacío
        document.getElementById("btnGuardarPedido").style.display = "none";
        document.getElementById("btnCancelarPedido").style.display = "none";
        pedidoTabla = [];
    }
    if (pedidoTabla2.length > 0) {
        // Si hay datos, recuperar y procesar la tabla
        document.getElementById("btnGuardarPedido2").style.display = "flex";
        document.getElementById("btnCancelarPedido2").style.display = "flex";
        recuperarTabla2(pedidoTabla2);
    } else {
        // Si no hay datos, inicializar pedidoTabla como un arreglo vacío
        document.getElementById("btnGuardarPedido2").style.display = "none";
        document.getElementById("btnCancelarPedido2").style.display = "none";
        pedidoTabla2 = [];
    }
    if (pedidoTabla3.length > 0) {
        // Si hay datos, recuperar y procesar la tabla
        document.getElementById("btnGuardarPedido3").style.display = "flex";
        document.getElementById("btnCancelarPedido3").style.display = "flex";
        recuperarTabla3(pedidoTabla3);
    } else {
        // Si no hay datos, inicializar pedidoTabla como un arreglo vacío
        document.getElementById("btnGuardarPedido3").style.display = "none";
        document.getElementById("btnCancelarPedido3").style.display = "none";
        pedidoTabla3 = [];
    }

    if(empresa==="FUNNY") {
        document.getElementById("month").style.display = "none";
        document.getElementById("year").style.display = "none";
        document.getElementById("lote").style.display = "none";
        document.getElementById("monthL").style.display = "none";
        document.getElementById("yearL").style.display = "none";
        document.getElementById("loteL").style.display = "none";
        document.getElementById("precioPublicoL").style.display = "none";
        document.getElementById("precioPublico").style.display = "none";

    } 

} catch (error) {
    // Código para manejar el error
    console.error("Ha ocurrido un error:", error.message);
} finally {
    // Código que se ejecuta siempre
    console.log("Bloque finally ejecutado.");
}

try {
    cargarCategorias();
    fetchData();
   cargarSucursales();
   cargarClientes();

    const session = JSON.parse(localStorage.getItem("session") || "{}");
    if (["1", "3"].includes(session.userRole)) {
        fetchData2();
    }
  


    document.getElementById("ubicacion").value =  localStorage.getItem("ubicacion")
} catch (error) {
    console.error("Ha ocurrido un error:", error.message);
} finally {
    // Código que se ejecuta siempre
    console.log("Bloque finally ejecutado.");
}

  
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
const inputArchivoEdit = document.getElementById('archivoEdit');
const btnQuitarEdit = document.getElementById('btn-quitarEdit');

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
    IMAGEN=null;
});

// Mostrar el botón "Quitar" si se selecciona un archivo
inputArchivoEdit.addEventListener('change', function () {
    if (this.files && this.files.length > 0) {
        btnQuitarEdit.style.display = 'inline-block';
    }
});

// Quitar el archivo seleccionado
btnQuitarEdit.addEventListener('click', function () {
    inputArchivoEdit.value = ''; // Resetear el campo de archivo
    btnQuitarEdit.style.display = 'none'; // Ocultar el botón
    IMAGENEDIT=null;
});




document.getElementById('formRegistrar').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    saveArticulo(); // Llama a la función para registrar al alumno
});


document.getElementById('formInventario').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    saveInventario(); // Llama a la función para registrar al alumno
});

document.getElementById('formVentas').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    document.getElementById("btnGuardarPedido").style.display = "flex";
    document.getElementById("btnCancelarPedido").style.display = "flex";
    const productoCodigo = buscarProducto(document.getElementById("codigo4").value);
    if (productoCodigo) {
        // Si encuentra el producto por código
        guardarTabla(); // Llama a la función para registrar al alumno

    } else {
        alert('Producto no existe en la base de datos');
    }
});

document.getElementById('formVentas2').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    document.getElementById("btnGuardarPedido2").style.display = "flex";
    document.getElementById("btnCancelarPedido2").style.display = "flex";
    const productoCodigo = buscarProducto(document.getElementById("codigo6").value);
    if (productoCodigo) {
        // Si encuentra el producto por código
        guardarTabla6(); // Llama a la función para registrar al alumno

    } else {
        alert('Producto no existe en la base de datos');
    }
});

document.getElementById('formVentas3').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    document.getElementById("btnGuardarPedido3").style.display = "flex";
    document.getElementById("btnCancelarPedido3").style.display = "flex";
    const productoCodigo = buscarProducto(document.getElementById("codigo7").value);
    if (productoCodigo) {
        // Si encuentra el producto por código
        guardarTabla7(); // Llama a la función para registrar al alumno

    } else {
        alert('Producto no existe en la base de datos');
    }
});
const btnEliminar = document.getElementById('btnEliminar');
btnEliminar.addEventListener('click', function () {
       deleteArticulo();

});

const buscarExistenciaBod = document.getElementById('buscarExistenciaBod');
buscarExistenciaBod.addEventListener('click', function () {
  if(document.getElementById("codigo4").value ==="")
  {
    alert ("Ingrese codigo")
    return;
  }
    cargarFormularioExist(document.getElementById("codigo4").value);
});
const buscarExistenciaBod6 = document.getElementById('buscarExistenciaBod6');
buscarExistenciaBod6.addEventListener('click', function () {
  if(document.getElementById("codigo6").value ==="")
  {
    alert ("Ingrese codigo")
    return;
  }
    cargarFormularioExist(document.getElementById("codigo6").value);
});
const buscarExistenciaBod7 = document.getElementById('buscarExistenciaBod7');
buscarExistenciaBod7.addEventListener('click', function () {
  if(document.getElementById("codigo7").value ==="")
  {
    alert ("Ingrese codigo")
    return;
  }
    cargarFormularioExist(document.getElementById("codigo7").value);
});

const lupa = document.getElementById('lupa');
lupa.addEventListener('click', function () {
       cargarFormulario3();

});

const cantPe = document.getElementById('cantidadPe');
cantPe.addEventListener('input', () => {
    let cantidad = parseFloat(document.getElementById("cantidadPe").value.trim()) || 0;
    let precio = parseFloat(document.getElementById("precioPe").value) || 0;
   document.getElementById("totalPe").value = cantidad*precio


});

const precioPe = document.getElementById('precioPe');
precioPe.addEventListener('input', () => {
    let cantidad = parseFloat(document.getElementById("cantidadPe").value.trim()) || 0;
    let precio = parseFloat(document.getElementById("precioPe").value) || 0;
   document.getElementById("totalPe").value = cantidad*precio


});




const buscar = document.getElementById('btnbuscar');
buscar.addEventListener('click', function () {
    const inputCodigo = document.getElementById("codigo2");
    //const inputDescripcion = document.getElementById("descripcion2");
    const inputItem = document.getElementById("item2");
    // Intentar buscar con el valor de `txtcodigo2`
    const productoCodigo = buscarProducto(inputCodigo.value);
    if (productoCodigo) {
        // Si encuentra el producto por código
        actualizarCampos(productoCodigo);
        return; // Salir de la función
    }
    // Si no lo encuentra por código, intenta con el valor de `txtitem2`
    const productoItem = buscarItems(inputItem.value);
    if (productoItem) {
        // Si encuentra el producto por ítem
        actualizarCampos(productoItem);
        return; // Salir de la función
    }

    // Si no encuentra nada
    alert('Producto no encontrado');
});

// Función para actualizar los campos del formulario
function actualizarCampos(producto) {
    document.getElementById("codigo2").value = producto.ARTICULO;
    document.getElementById("descripcion2").value = producto.DESCRIPCION;
    document.getElementById("item2").value = producto.ITEM;
}



const buscar4 = document.getElementById('btnbuscar4');
buscar4.addEventListener('click', function () {
    const inputCodigo = document.getElementById("codigo4");
    //const inputDescripcion = document.getElementById("descripcion2");
    const inputItem = document.getElementById("item4");
    // Intentar buscar con el valor de `txtcodigo2`
    const productoCodigo = buscarProducto(inputCodigo.value);
    if (productoCodigo) {
        // Si encuentra el producto por código
        actualizarCampos4(productoCodigo);
        closeModal()
        return; // Salir de la función
    }
    // Si no lo encuentra por código, intenta con el valor de `txtitem2`
    const productoItem = buscarItems(inputItem.value);
    if (productoItem) {
        // Si encuentra el producto por ítem
        actualizarCampos4(productoItem);
        return; // Salir de la función
    }

    // Si no encuentra nada
    alert('Producto no encontrado');
});

const buscar6 = document.getElementById('btnbuscar6');
buscar6.addEventListener('click', function () {
    const inputCodigo = document.getElementById("codigo6");
    //const inputDescripcion = document.getElementById("descripcion2");
    const inputItem = document.getElementById("item6");
    // Intentar buscar con el valor de `txtcodigo2`
    const productoCodigo = buscarProducto(inputCodigo.value);
    if (productoCodigo) {
        // Si encuentra el producto por código
        actualizarCampos6(productoCodigo);
        closeModal()
        return; // Salir de la función
    }
    // Si no lo encuentra por código, intenta con el valor de `txtitem2`
    const productoItem = buscarItems(inputItem.value);
    if (productoItem) {
        // Si encuentra el producto por ítem
        actualizarCampos6(productoItem);
        return; // Salir de la función
    }

    // Si no encuentra nada
    alert('Producto no encontrado');
});

const buscar7 = document.getElementById('btnbuscar7');
buscar7.addEventListener('click', function () {
    const inputCodigo = document.getElementById("codigo7");
    //const inputDescripcion = document.getElementById("descripcion2");
    const inputItem = document.getElementById("item7");
    // Intentar buscar con el valor de `txtcodigo2`
    const productoCodigo = buscarProducto(inputCodigo.value);
    if (productoCodigo) {
        // Si encuentra el producto por código
        actualizarCampos7(productoCodigo);
        closeModal()
        return; // Salir de la función
    }
    // Si no lo encuentra por código, intenta con el valor de `txtitem2`
    const productoItem = buscarItems(inputItem.value);
    if (productoItem) {
        // Si encuentra el producto por ítem
        actualizarCampos7(productoItem);
        return; // Salir de la función
    }

    // Si no encuentra nada
    alert('Producto no encontrado');
});

// Función para actualizar los campos del formulario
function actualizarCampos4(prod) {
    document.getElementById("codigo4").value = prod.ARTICULO || '';
    document.getElementById("descripcion4").value = prod.DESCRIPCION || '';
    document.getElementById("item4").value = prod.ITEM || '';
    document.getElementById("precio4").value = prod.PRECIO_MAYOREO || prod.PRECIO ||  0;
    document.getElementById("cantidad4").value = 1
    // Obtén los valores de los campos
let precio = parseFloat(document.getElementById("precio4").value) || 0;
let cantidad = parseFloat(document.getElementById("cantidad4").value) || 0;
// Calcula el total
let total = precio * cantidad;
formatear("precio4",precio)
formatear("total4",total)
}
// Función para actualizar los campos del formulario
function actualizarCampos6(prod) {
    document.getElementById("codigo6").value = prod.ARTICULO || '';
    document.getElementById("descripcion6").value = prod.DESCRIPCION || '';
    document.getElementById("item6").value = prod.ITEM || '';
    document.getElementById("precio6").value = prod.PRECIO_MAYOREO || prod.PRECIO ||  0;;
    document.getElementById("cantidad6").value = 1
    // Obtén los valores de los campos
let precio = parseFloat(document.getElementById("precio6").value) || 0;
let cantidad = parseFloat(document.getElementById("cantidad6").value) || 0;
// Calcula el total
let total = precio * cantidad;
formatear("precio6",precio)
formatear("total6",total)
}

function actualizarCampos7(prod) {
    document.getElementById("codigo7").value = prod.ARTICULO || '';
    document.getElementById("descripcion7").value = prod.DESCRIPCION || '';
    document.getElementById("item7").value = prod.ITEM || '';
    document.getElementById("precio7").value = prod.PRECIO_MAYOREO || prod.PRECIO ||  0;
    document.getElementById("cantidad7").value = 1
    // Obtén los valores de los campos
let precio = parseFloat(document.getElementById("precio7").value) || 0;
let cantidad = parseFloat(document.getElementById("cantidad7").value) || 0;
// Calcula el total
let total = precio * cantidad;
formatear("precio7",precio)
formatear("total7",total)
}



function formatear(control,valor) {
  try {
    

    document.getElementById(control).value = valor.toLocaleString('en-US', {
        minimumFractionDigits: 2,  // Número mínimo de decimales
        maximumFractionDigits: 6   // Número máximo de decimales
    }).replace(/,/g, '');
} catch (error) {
 console.log(error.message())   ;
}
    
}
function formatoNumero(valor) {
     valor.toLocaleString('en-US', {
        minimumFractionDigits: 2,  // Número mínimo de decimales
        maximumFractionDigits: 6   // Número máximo de decimales
    })
}
function selccionarDato4(id) {

    // Si encuentras el registro, puedes hacer algo con él, por ejemplo, mostrarlo en un formulario
    const productoCodigo = buscarProducto(id);
    if (productoCodigo) {
        // Si encuentra el producto por código
        actualizarCampos4(productoCodigo);
        closeModal()
        return; // Salir de la función
    }
}

    


// Función para agregar los títulos a la tabla existente
function agregarTitulosTabla() {
    const tabla = document.getElementById("tablaDatos4"); // Selecciona la tabla existente

    // Crea una fila para los encabezados
    const filaEncabezado = document.createElement("tr");

    // Define los títulos de los encabezados
    const encabezados = ["ARTICULO", "DESCRIPCIÓN", "CANTIDAD","PRECIO", "TOTAL", "ACCION"];

    encabezados.forEach(titulo => {
        const th = document.createElement("th");
        th.textContent = titulo; // Asigna el texto del encabezado
        th.style.border = "1px solid #ddd";
        th.style.padding = "8px";
        th.style.textAlign = "center";
        th.style.backgroundColor = "#f4f4f4";
        th.style.fontWeight = "bold";
        filaEncabezado.appendChild(th);
    });

    // Agrega la fila de encabezados a la tabla
    tabla.appendChild(filaEncabezado);
}
function switchTab(event, tabId) {
   // Ocultar todas las pestañas
   const tabs = document.querySelectorAll('.tab-content');
   tabs.forEach(tab => tab.classList.remove('active-tab'));

   // Mostrar la pestaña seleccionada
   document.getElementById(tabId).classList.add('active-tab');

   // Cambiar el título según la pestaña seleccionada
   const tituloPedido = document.getElementById('tituloPedido');
   if (tabId === 'venta1') {
       tituloPedido.textContent = 'Pedido de Cliente 1';
   } else if (tabId === 'venta2') {
       tituloPedido.textContent = 'Pedido de Cliente 2';
   } else if (tabId === 'venta3') {
       tituloPedido.textContent = 'Pedido de Cliente 3'; 
   }  else if (tabId === 'venta4') {
    tituloPedido.textContent = 'Pedido de Cliente 4'; 
   }
    else if (tabId === 'venta5') {
        tituloPedido.textContent = 'Pedido de Cliente 5'; 
    }
   

   // Marcar el botón activo
   const buttons = document.querySelectorAll('.tab-button');
   buttons.forEach(button => button.classList.remove('active'));
   event.currentTarget.classList.add('active');
   localStorage.setItem('ventana', tabId);
}

function eliminarFila(enlace) {
    const row = enlace.parentNode.parentNode; // Encuentra la fila del enlace
    pedidoTabla.splice(row.rowIndex-1, 1); // Elimina el elemento en el índice
    localStorage.removeItem("pedidoTabla"); 
    localStorage.setItem('pedidoTabla', JSON.stringify(pedidoTabla));
    recuperarTabla(pedidoTabla);
}
function eliminarFila2(enlace) {
    const row = enlace.parentNode.parentNode; // Encuentra la fila del enlace
    pedidoTabla2.splice(row.rowIndex-1, 1); // Elimina el elemento en el índice
    localStorage.removeItem("pedidoTabla2"); 
    localStorage.setItem('pedidoTabla2', JSON.stringify(pedidoTabla2));
    recuperarTabla2(pedidoTabla2);
}
function eliminarFila3(enlace) {
    const row = enlace.parentNode.parentNode; // Encuentra la fila del enlace
    pedidoTabla3.splice(row.rowIndex-1, 1); // Elimina el elemento en el índice
    localStorage.removeItem("pedidoTabla3"); 
    localStorage.setItem('pedidoTabla3', JSON.stringify(pedidoTabla3));
    recuperarTabla3(pedidoTabla3);
}

document.getElementById("filtroInputCliente").addEventListener("input", function() {
    filtrarDatosClientes();
});
document.getElementById("filtroInputCot").addEventListener("input", function() {
    filtrarDatosCot();
});
document.getElementById("filtroInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        filtrarDatos();
    }
});

document.getElementById("filtroInput5").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        filtrarDatos5();
    }
});