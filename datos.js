const url = "https://apitest.grupocarosa.com/ApiDatos/"
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