const url = "https://apitest.grupocarosa.com/ApiDatos/"
let IMAGEN = null
let user
let productos = [];

const fetchEjecutar = async (funct) => {
    try {
        const response = await fetch(
            url + funct
        );
        if (response.ok) {
            const data = await response.json();
            return data;
            
        } else {
            throw new Error(`Error en la petición. Código de estado:  ${response.status}`);
        }
    } catch (error) {
        console.error('Error en la petición:', error.message);
        throw error;
    }
};



async function cargarCategorias() {
    try {
      
        const selectBranch = document.getElementById('categoria');
        const selectBranch2 = document.getElementById('categoriaEdit');
        if (!selectBranch) return;
         // Verificar si ya hay datos cargados
         if (selectBranch.children.length > 1) {
            console.log('Los Distritos ya están categoria.');
            return;
        }
        const dat = await fetchEjecutar("categoriasProd");
        dat.forEach(data => {
            const option = document.createElement('option');
            option.value = data.CLASIFICACION;
            option.textContent = data.DESCRIPCION;
            selectBranch.appendChild(option);

            
        });

        dat.forEach(data => {
            const option2 = document.createElement('option');
            option2.value = data.CLASIFICACION;
            option2.textContent = data.DESCRIPCION;
            selectBranch2.appendChild(option2);
            
        });


    } catch (error) {
        console.error('Error al cargar los categoria:', error.message);
        const selectBranch = document.getElementById('categoria');
        const option = document.createElement('option');
        option.value = "error";
        option.textContent = error.message;
        selectBranch.appendChild(option);
    }
};
function reducirYConvertirImagen(archivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const maxDimension = 1024; // Tamaño máximo en px
                let width = img.width;
                let height = img.height;

                // Redimensionar la imagen si es demasiado grande
                if (width > height && width > maxDimension) {
                    height = Math.round((height *= maxDimension / width));
                    width = maxDimension;
                } else if (height > maxDimension) {
                    width = Math.round((width *= maxDimension / height));
                    height = maxDimension;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convertir el canvas a base64
                canvas.toBlob(
                    blob => {
                        const readerBlob = new FileReader();
                        readerBlob.onload = function (e) {
                            resolve(e.target.result);
                        };
                        readerBlob.onerror = reject;
                        readerBlob.readAsDataURL(blob);
                    },
                    'image/jpeg',
                    0.8 // Calidad (80%)
                );
            };
            img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(archivo);
    });
}

// Uso:
document.getElementById('archivo').addEventListener('change', function (event) {
    const archivo = event.target.files[0];

    if (!archivo) return;
 
    reducirYConvertirImagen(archivo)
        .then(base64 => {
            IMAGEN = base64.replace(/^data:.+;base64,/, '');
            //console.log("Imagen redimensionada y convertida:", IMAGEN);
           // alert(IMAGEN);
        })
        .catch(error => {
            console.error("Error al redimensionar o convertir la imagen:", error);
        });
});

function buscarProducto(codigo) {
    return productos.find(producto => producto.ARTICULO === codigo);
}

// Guardar sucursal (creación o edición)
async function  saveArticulo(event) {

    //event.preventDefault(); // Evitar recarga de la página
    const articulo = document.getElementById("codigo").value;
    const descripcion = document.getElementById("descripcion").value;
    const clasi1 = document.getElementById("categoria").value.charAt(0) || null;;
    const clasi2 = document.getElementById("categoria").value;
    const bulto = document.getElementById("cantidad").value;
    const precio = document.getElementById("precio").value;
    const precioUnit = parseFloat(document.getElementById("precioUnit").value) || 0;
    const precioNomal = document.getElementById("precioNomal").value;
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    const itemInsert = document.getElementById("item").value ;

    const productoEncontrado = buscarProducto(articulo);

    if (productoEncontrado) {
        // Si el producto existe, detén el escáner y muestra un mensaje
        alert(`Producto encontrado: ${productoEncontrado.ARTICULO}, NOMBRE: ${productoEncontrado.DESCRIPCION}`);
          // Limpiar el formulario
          document.getElementById('formRegistrar').reset();  // 'miFormulario' es el ID del formulario
          document.getElementById('btn-quitar').style.display = 'none';  // Ocultar el botón
          IMAGEN=null;
        return; // Sale de la función para que no continúe
    } 
   // const usuario = "sa";
   
        // Envía los datos al backend mediante fetch
        fetch(url+"articulo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accion:"INSERT",  articulo,  descripcion,  clasi1,  clasi2,  bulto,  precio,  precioUnit,  fotografia:IMAGEN,  usuario:session.user,precioNomal,itemInsert })
    }) 
        .then(response => {
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();  // Leer la respuesta como texto
        })
        .then(text => {
            console.log('Raw response:', text);  // Verifica lo que devuelve el servidor
            try {
                // Intentar convertir el texto a JSON
                const result = JSON.parse(text);
                console.log(result);  // Ver el contenido del objeto JSON
                if (result.success) {
                    //alert('Producto registrado con éxito');
                    alert('Producto registrado con éxito codigo: ' + result.data[0].ARTICULO);
                    // Limpiar el formulario
                    document.getElementById('interno').checked =false;
                    document.getElementById('codigo').required = true; // Activa el atributo 'required'
                    document.getElementById('codigo').disabled = false; // Habilita el campo nuevamente
                    document.getElementById('start-scan').disabled = false;
                    document.getElementById('stop-scan').disabled = false;
                     // Limpiar el formulario
                    document.getElementById('formRegistrar').reset();  // 'miFormulario' es el ID del formulario
                    document.getElementById('btn-quitar').style.display = 'none';  // Ocultar el botón
                    IMAGEN=null;
                        // Regresar al principio de la página
                        window.scrollTo(0, 0);
                        fetchData();
                } else {
                    const errorMessage = result.data[0].ErrorMessage;
                    if (errorMessage.includes("Violation of PRIMARY KEY")) {
                      console.log("El mensaje contiene 'Violation of PRIMARY KEY'.");
                      alert('Producto ya existe!!!');
                      // Limpiar el formulario
                     document.getElementById('formRegistrar').reset();  // 'miFormulario' es el ID del formulario
                     document.getElementById('btn-quitar').style.display = 'none';  // Ocultar el botón
                     IMAGEN=null;
                         // Regresar al principio de la página
                         window.scrollTo(0, 0);
                         
                    } else {
                        console.error('Error:', text);
                    alert('Hubo un error al registrar al PRODUCTO: ' + text);
                    }
                    
                  
                }
            } catch (e) {
                console.error('Error al procesar la respuesta JSON:', e);
                alert('Hubo un error al procesar la respuesta del servidor',e);
            }
        })
        .catch(error => {
            console.error('Error al procesar la solicitud:', error);
            alert('Hubo un error al procesar la solicitud');
        });
};

async function  deleteArticulo(event) {
    //event.preventDefault(); // Evitar recarga de la página
    const articulo = document.getElementById("articulo").value;
    const descripcion = document.getElementById("descripcionEdit").value;
    const items = document.getElementById("items").value.trim() === "" ? null: document.getElementById("items").value.trim();
    const cat1 = document.getElementById("categoriaEdit").value.charAt(0) || null;;
    const cat2 = document.getElementById("categoriaEdit").value;

    if (document.getElementById("articulo").readOnly) {
            try {
                const response = await articuloEdit("DELETE", articulo,descripcion,items,"FUNNY",cat1,cat2);
                console.log("DELETED ARTICULO:", response); 
                // Lógica para actualizar la fila correspondiente en la tabla
                //updateTableRowVend(id, nombre); // Función para actualizar la fila
                fetchData();
                closeModal();
                
            } catch (error) {
                console.error("Error al actualizar DELETED:", error.message);
                alert("Error al ELIMINAR ");
            }
       
    }

    
};

// Función para leer el archivo como ArrayBuffer
function convertirArchivoABase64(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        
        lector.onload = function(event) {
          resolve(event.target.result);  // Resuelve la promesa con el resultado base64
        };
        
        lector.onerror = function(error) {
          reject(error);  // Si ocurre un error, rechaza la promesa
        };
        
        lector.readAsDataURL(archivo);  // Lee el archivo como base64
      });
}


function generarTabla(datos) {
    const tablaExistente = document.getElementById('tablaDatos'); // Identifica la tabla existente

    // Elimina la tabla anterior, si existe
    if (tablaExistente) {
        tablaExistente.remove();
    }

    const section = document.getElementById('datos');

    if (!datos.length) {
        // Verifica si ya existe el mensaje "No hay datos disponibles"
        if (!document.getElementById('mensajeNoDatos')) {
            const mensaje = document.createElement('p');
            mensaje.textContent = 'No hay datos disponibles.';
            mensaje.id = 'mensajeNoDatos';
            section.appendChild(mensaje);
        }
        return;
    } else {
        // Elimina el mensaje si los datos están disponibles
        const mensajeNoDatos = document.getElementById('mensajeNoDatos');
        if (mensajeNoDatos) mensajeNoDatos.remove();
    }
    

    const table = document.createElement('table');
    table.id = 'tablaDatos'; // Asigna un ID único a la tabla
    table.border = '1';

    // Genera el encabezado de la tabla dinámicamente
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    Object.keys(datos[0]).forEach((columna) => {
        const th = document.createElement('th');
        th.textContent = columna;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Genera el cuerpo de la tabla
    const tbody = document.createElement('tbody');
    datos.forEach((fila) => {
        const tr = document.createElement('tr');
        Object.entries(fila).forEach(([columna, valor]) => {
            const td = document.createElement('td');
            // Si la columna es una fecha en formato /Date(...)/, la convertimos
            if (typeof valor === 'string' && valor.includes('/Date(') && valor.includes(')/')) {
                const timestamp = valor.match(/\/Date\((\d+)\)\//)[1];
                const fecha = new Date(parseInt(timestamp)); // Convierte el timestamp a una fecha
                
                // Formatea la fecha y hora en el formato dd/MM/yyyy hh:mm AM/PM
                const dia = fecha.getDate().toString().padStart(2, '0');
                const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                const anio = fecha.getFullYear();
                let horas = fecha.getHours();
                const minutos = fecha.getMinutes().toString().padStart(2, '0');
                const ampm = horas >= 12 ? 'PM' : 'AM';
                horas = horas % 12 || 12; // Convierte a formato de 12 horas
                td.textContent = `${dia}/${mes}/${anio} ${horas}:${minutos} ${ampm}`;
            } else if (columna === 'ARTICULO') {
                // Convierte el ID en un enlace
                const enlace = document.createElement('a');
                enlace.href = `editar.html?id=${valor}`; // URL para editar
                enlace.textContent = valor;
                enlace.onclick = (event) => {
                    event.preventDefault(); // Evita el comportamiento por defecto
                    editarRegistro(valor); // Llama a la función de edición
                };
                td.appendChild(enlace);
            } else {
                td.textContent = valor;
            }

            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Inserta la tabla al final de la sección
    section.appendChild(table);
    document.getElementById("filtroInput").value="";
}


function editarRegistro(id) {

    const session = JSON.parse(localStorage.getItem("session") || "{}");
    if (session.userRole !="1") {
        return;
    }
    
    // Obtener la tabla 'tablaDatos' desde localStorage
//let tablaDatos = JSON.parse(localStorage.getItem("tablaDatos"));

// Filtrar la tabla de datos para obtener el registro con el ID seleccionado
let registroSeleccionado = productos.filter(item => item.ARTICULO === id);

// Si encuentras el registro, puedes hacer algo con él, por ejemplo, mostrarlo en un formulario
if (registroSeleccionado.length > 0) {
    console.log("Registro encontrado:", registroSeleccionado[0]);
    
    cargarFormulario(registroSeleccionado[0])
       // Abrir el modal
       const modal = document.getElementById("formulario");
       modal.style.display = "flex"; // Mostrar el modal
} else {
    console.log("Registro no encontrado");
}
}

const articuloEdit = async (accion, articulo, descripcion, items,empresa,cat1,cat2) => {
    try {
        const response = await fetch(url + "articuloEdit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accion, articulo, descripcion, items,empresa,cat1,cat2
            })
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Error en la petición. Código de estado: ${response.status}`);
        }
    } catch (error) {
        console.error("Error en la petición:", error.message);
        throw error;
    }
};
 // Función para filtrar los datos
 function filtrarDatos() {
    const filtro = document.getElementById("filtroInput").value.toLowerCase();
    const resultados = productos.filter(articulo => {
        const articuloTexto = (articulo.ARTICULO || "").toLowerCase();
        const descripcionTexto = (articulo.DESCRIPCION || "").toLowerCase();
        const itemTexto = (articulo.ITEM || "").toLowerCase();

        return articuloTexto.includes(filtro) ||
               descripcionTexto.includes(filtro) ||
               itemTexto.includes(filtro);
    });
    
    generarTabla(resultados);
}


async function  saveRegistro(event) {
    event.preventDefault(); // Evitar recarga de la página
    const articulo = document.getElementById("articulo").value;
    const descripcion = document.getElementById("descripcionEdit").value;
    const items = document.getElementById("items").value.trim() === "" ? null: document.getElementById("items").value.trim();
    const cat1 = document.getElementById("categoriaEdit").value.charAt(0) || null;;
    const cat2 = document.getElementById("categoriaEdit").value;

    if (document.getElementById("articulo").readOnly) {
            try {
                const response = await articuloEdit("UPDATE2", articulo,descripcion,items,"FUNNY",cat1,cat2);
                console.log("Actualizado:", response); 
                // Lógica para actualizar la fila correspondiente en la tabla
                //updateTableRowVend(id, nombre); // Función para actualizar la fila
                fetchData();
                closeModal();
                
            } catch (error) {
                console.error("Error al actualizar registro:", error.message);
                alert("Error al actualizar ");
            }
       
    }

    
};
function closeModal() {
    const modal= document.getElementById("formulario");
    modal.style.display = "none";
}

function cargarFormulario(registro) {
    // Obtener el registro con el ID correspondiente
    
    if (registro) {
        // Llenar los campos del formulario con los datos del registro
            document.getElementById("articulo").value = registro.ARTICULO;
        document.getElementById("descripcionEdit").value = registro.DESCRIPCION;

               // Seleccionar el estado actual del registro
        document.getElementById("items").value = registro.ITEM;
        document.getElementById("categoriaEdit").value = registro.CODIGO;


    }
}

async function fetchData() {
    try {
        // Llama al endpoint con las fechas como parámetros
        const response = await fetch(url + "selectProductos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                empresa:"FUNNY"
            })
        });

        if (!response.ok) throw new Error('Error al obtener los datos.');
        const data = await response.json();
        productos =data
        // Genera la tabla y la inserta en la sección "datos"
        generarTabla(data);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}
// Hacer la función accesible globalmente
window.buscarProducto = buscarProducto;