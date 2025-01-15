const url = "https://apitest.grupocarosa.com/ApiDatos/"
let IMAGEN = null
let user

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
            console.log("Imagen redimensionada y convertida:", IMAGEN);
        })
        .catch(error => {
            console.error("Error al redimensionar o convertir la imagen:", error);
        });
});


// Guardar sucursal (creación o edición)
async function  saveArticulo(event) {
    //event.preventDefault(); // Evitar recarga de la página
    const articulo = document.getElementById("codigo").value;
    const descripcion = document.getElementById("descripcion").value;
    const clasi1 = document.getElementById("categoria").value.charAt(0) || null;;
    const clasi2 = document.getElementById("categoria").value;
    const bulto = document.getElementById("cantidad").value;
    const precio = document.getElementById("precio").value;
    const precioUnit = document.getElementById("precioUnit").value;
    const session = JSON.parse(localStorage.getItem("session") || "{}");

   // const usuario = "sa";
   
        // Envía los datos al backend mediante fetch
        fetch(url+"articulo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accion:"INSERT",  articulo,  descripcion,  clasi1,  clasi2,  bulto,  precio,  precioUnit,  fotografia:IMAGEN,  usuario:session.user })
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
                    alert('Producto registrado con éxito');
                     // Limpiar el formulario
                    document.getElementById('formRegistrar').reset();  // 'miFormulario' es el ID del formulario
                    document.getElementById('btn-quitar').style.display = 'none';  // Ocultar el botón
                    IMAGEN=null;
                        // Regresar al principio de la página
                        window.scrollTo(0, 0);
    
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

