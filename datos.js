const url = "https://apitest.grupocarosa.com/ApiDatos/"

const articulo = async (accion,  articulo,  descripcion,  clasi1,  clasi2,  bulto,  precio,  precioUnit,  fotografia,  usuario) => {
    try {
        const response = await fetch(url + "articulo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accion,  articulo,  descripcion,  clasi1,  clasi2,  bulto,  precio,  precioUnit,  fotografia,  usuario
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


// Guardar sucursal (creación o edición)
async function  saveArticulo(event) {
    event.preventDefault(); // Evitar recarga de la página
    const articulo = document.getElementById("codigo").value;
    const descripcion = document.getElementById("descripcion").value;
    const clasi1 = document.getElementById("categoria").value.charAt(0) || null;;
    const clasi2 = document.getElementById("categoria").value;
    const bulto = document.getElementById("cantidad").value;
    const precio = document.getElementById("precio").value;
    const precioUnit = document.getElementById("precioUnit").value;
    const fotografia = document.getElementById("archivo").value;
    // Asegúrate de que se ha seleccionado un archivo
    if (fotografia) {
        // Convertir el archivo a base64 cuando se seleccione
        convertirArchivoABase64(fotografia).then(base64 => {
          // Asigna el archivo base64 a la variable global DOC_DUI
          fotografia =  base64.replace(/^data:.+;base64,/, '');
         // console.log("Archivo en base64:", DOC_INCRIPCION);  // Puedes ver el resultado en la consola
        }).catch(error => {
          console.error('Error al convertir el archivo a base64:', error);
          fotografia =null;
        });
      }

    const usuario = "";

    


        // Aquí puedes agregar la lógica para agregar una nueva fila en la tabla
        try {
            const response = await articulo("INSERT",  articulo,  descripcion,  clasi1,  clasi2,  bulto,  precio,  precioUnit,  fotografia,  usuario)
            console.log("Sucursal INSERTADA:", response);
            // Lógica para actualizar la fila correspondiente en la tabla
           // updateTableRow(id, nombre, ubicacion); // Función para actualizar la fila
           //cargarSuc();

        } catch (error) {
            console.error("Error al actualizar la sucursal:", error.message);
            alert("Error al crear ");
        }


    closeModal();
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

