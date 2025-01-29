function guardarTabla6(){
    const nombre = document.getElementById("nombreCliente6").value;

    let numeroFilas = pedidoTabla2.length; // Contar las filas actuales

   let nuevoPedido = {
    ARTICULO: document.getElementById("codigo6").value,        
    DESCRIPCION: document.getElementById("descripcion6").value, 
    CANTIDAD: document.getElementById("cantidad6").value, 
    PRECIO: parseFloat(document.getElementById("precio6").value), 
    TOTAL: parseFloat(document.getElementById("total6").value), 
    ACCION: numeroFilas + "Eliminar"
    };

// Agregar el nuevo pedido al arreglo
pedidoTabla2.push(nuevoPedido);
localStorage.setItem('pedidoTabla2', JSON.stringify(pedidoTabla2));

let sumaTotal = 0;

for (let fila of pedidoTabla2) {
    sumaTotal += fila.TOTAL;
}
let sumaFormateada = sumaTotal.toFixed(2)
// Función para sumar la columna total

document.getElementById("totalGeneral6").textContent  = " Total $ " + sumaFormateada.toString();
//document.getElementById("totalGeneral").value = formatear("totalGeneral",document.getElementById("totalGeneral").value)
generarTabla6(pedidoTabla2);
document.getElementById('formVentas2').reset();  // 'miFormulario' es el ID del formulario
document.getElementById("nombreCliente6").value =nombre;
window.scrollTo(0, 0);
};

//VENTA 2
function guardarTabla(){
    const nombre = document.getElementById("nombreCliente4").value;

    let numeroFilas = pedidoTabla.length; // Contar las filas actuales

   let nuevoPedido = {
    ARTICULO: document.getElementById("codigo4").value,        
    DESCRIPCION: document.getElementById("descripcion4").value, 
    CANTIDAD: document.getElementById("cantidad4").value, 
    PRECIO: parseFloat(document.getElementById("precio4").value), 
    TOTAL: parseFloat(document.getElementById("total4").value), 
    ACCION: numeroFilas + "Eliminar"
    };

// Agregar el nuevo pedido al arreglo
pedidoTabla.push(nuevoPedido);
localStorage.setItem('pedidoTabla', JSON.stringify(pedidoTabla));

let sumaTotal = 0;

for (let fila of pedidoTabla) {
    sumaTotal += fila.TOTAL;
}
let sumaFormateada = sumaTotal.toFixed(2)
// Función para sumar la columna total

document.getElementById("totalGeneral").textContent  = " Total $ " + sumaFormateada.toString();
//document.getElementById("totalGeneral").value = formatear("totalGeneral",document.getElementById("totalGeneral").value)
generarTabla4(pedidoTabla);
document.getElementById('formVentas').reset();  // 'miFormulario' es el ID del formulario
document.getElementById("nombreCliente4").value =nombre;
window.scrollTo(0, 0);
};



// tablas
async function  savePedido(button) {
    button.disabled = true;
    let cot = 0
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    let nom = document.getElementById("nombreCliente4").value || ""

let sumaTotal = 0;

for (let fila of pedidoTabla) {
    sumaTotal += fila.TOTAL;
}
 // Envía los datos al backend mediante fetch
 fetch(url+"cotizaciones", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        accion:"INSERT", usuario:session.user,  vendedor:session.vendedor || session.user ,  nombre:nom,  total:sumaTotal })
}) 
.then(response => {
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();  // Leer la respuesta como texto
})
.then(async text => {
    console.log('Raw response:', text);  // Verifica lo que devuelve el servidor
    try {
        // Intentar convertir el texto a JSON
        const result = JSON.parse(text);
        console.log(result);  // Ver el contenido del objeto JSON
        if (result.success) {
        let i =0;
       cot =result.cotizacion;
                 
       
      for (let fila of pedidoTabla) {
                 i++; // Incrementa el índice
                let eje =  await   cotizacionLinea("INSERT",  fila.ARTICULO,  fila.DESCRIPCION,  fila.CANTIDAD,  fila.PRECIO,  fila.TOTAL,  i,  cot);

       }

      
            document.getElementById("btnGuardarPedido").style.display = "none";
            document.getElementById("btnCancelarPedido").style.display = "none";
            document.getElementById("totalGeneral").textContent  =""
            document.getElementById("tablaDatos4").innerHTML = "";  
            document.getElementById("nombreCliente4").value=""

            localStorage.removeItem("pedidoTabla"); 
            pedidoTabla =  [];
            alert('Cotizacion registrada con éxito No. ' + cot);
            button.disabled = false;
        } else {
            const errorMessage = result.data[0].ErrorMessage;
            button.disabled = false;
            console.error('Error:', errorMessage);
            alert('Hubo un error al registrar: ' + errorMessage);
                  
          
        }
    } catch (e) {
        button.disabled = false;
        console.error('Error al procesar la respuesta JSON:', e);
        alert('Hubo un error al procesar la respuesta del servidor',e);
    }
}

)
.catch(error => {
    button.disabled = false;
    console.error('Error al procesar la solicitud:', error);
    alert('Hubo un error al procesar la solicitud');
}) 
};



async function  cancelarPedido() {
let tab =   localStorage.getItem("ventana") || "venta1"
if (tab =="venta1") {
    localStorage.removeItem("nombreCliente"); 
    localStorage.removeItem("pedidoTabla"); 
    pedidoTabla =  [];
    document.getElementById("btnGuardarPedido").style.display = "none";
    document.getElementById("btnCancelarPedido").style.display = "none";
    document.getElementById("totalGeneral").textContent  =""
    document.getElementById("tablaDatos4").innerHTML = "";
    document.getElementById("nombreCliente4").value=""
    localStorage.removeItem("nombreCliente4"); 
   
}
if (tab =="venta2") {
    localStorage.removeItem("nombreCliente2"); 
    localStorage.removeItem("pedidoTabla2"); 
    pedidoTabla2 =  [];
    document.getElementById("btnGuardarPedido2").style.display = "none";
    document.getElementById("btnCancelarPedido2").style.display = "none";
    document.getElementById("totalGeneral6").textContent  =""
    document.getElementById("tablaDatos6").innerHTML = "";
    document.getElementById("nombreCliente6").value=""
}

if (tab =="venta3") {
    localStorage.removeItem("nombreCliente3"); 
    localStorage.removeItem("pedidoTabla3"); 
    pedidoTabla3 =  [];
    document.getElementById("btnGuardarPedido3").style.display = "none";
    document.getElementById("btnCancelarPedido3").style.display = "none";
    document.getElementById("totalGeneral7").textContent  =""
    document.getElementById("tablaDatos7").innerHTML = "";
    document.getElementById("nombreCliente7").value=""  
}
};

function recuperarTabla(nuevoPedido){
    let sumaTotal = 0; 
    for (let fila of nuevoPedido) {
        sumaTotal += fila.TOTAL;
    }
    let sumaFormateada = sumaTotal.toFixed(2)
    // Función para sumar la columna total
    
    document.getElementById("totalGeneral").textContent  = " Total $ " + sumaFormateada.toString();
    //document.getElementById("totalGeneral").value = formatear("totalGeneral",document.getElementById("totalGeneral").value)
    generarTabla4(nuevoPedido);
    document.getElementById('formVentas').reset();  // 'miFormulario' es el ID del formulario
    //window.scrollTo(0, 0);
    };
   
    function recuperarTabla2(nuevoPedido){
    
       let sumaTotal = 0; 
       for (let fila of nuevoPedido) {
           sumaTotal += fila.TOTAL;
       }
       let sumaFormateada = sumaTotal.toFixed(2)
       // Función para sumar la columna total
       
       document.getElementById("totalGeneral6").textContent  = " Total $ " + sumaFormateada.toString();
       //document.getElementById("totalGeneral").value = formatear("totalGeneral",document.getElementById("totalGeneral").value)
       generarTabla6(nuevoPedido);
       document.getElementById('formVentas').reset();  // 'miFormulario' es el ID del formulario
       window.scrollTo(0, 0);
   };
   
   function recuperarTabla3(nuevoPedido){
    
           let sumaTotal = 0; 
           for (let fila of nuevoPedido) {
               sumaTotal += fila.TOTAL;
           }
           let sumaFormateada = sumaTotal.toFixed(2)
           // Función para sumar la columna total
           
           document.getElementById("totalGeneral7").textContent  = " Total $ " + sumaFormateada.toString();
           //document.getElementById("totalGeneral").value = formatear("totalGeneral",document.getElementById("totalGeneral").value)
           generarTabla7(nuevoPedido);
           document.getElementById('formVentas').reset();  // 'miFormulario' es el ID del formulario
           window.scrollTo(0, 0);
   };


//VENTA 1
const cant4 = document.getElementById('cantidad4');
cant4.addEventListener('input', () => {
    let codigo = document.getElementById("codigo4").value
    let cantidad = parseFloat(document.getElementById("cantidad4").value.trim()) || 0;
    let precio = parseFloat(document.getElementById("precio4").value) || 0;
    if (cantidad > 0){   
        let valorbusado = buscarProducto(codigo)
        precio =  valorbusado.PRECIO_MAYOREO
        document.getElementById("precio4").value = precio
        formatear("precio4",precio)
    }  else 
    {
        let valorbusado = buscarProducto(codigo)
        precio =  valorbusado.PRECIO
        document.getElementById("precio4").value = precio
        formatear("precio4",precio)
    }

    formatear("total4",precio*cantidad)

});
const prec4 = document.getElementById('precio4');
prec4.addEventListener('input', () => {
    let cantidad = parseFloat(document.getElementById("cantidad4").value.trim()) || 0;
    let precio = parseFloat(document.getElementById("precio4").value) || 0;


    formatear("total4",precio*cantidad)

});
// venta 2
const cant6 = document.getElementById('cantidad6');
cant6.addEventListener('input', () => {
    let codigo = document.getElementById("codigo6").value
    let cantidad = parseFloat(document.getElementById("cantidad6").value.trim()) || 0;
    let precio = parseFloat(document.getElementById("precio6").value) || 0;
    if (cantidad > 0){   
        let valorbusado = buscarProducto(codigo)
        precio =  valorbusado.PRECIO_MAYOREO
        document.getElementById("precio6").value = precio
        formatear("precio6",precio)
    }  else 
    {
        let valorbusado = buscarProducto(codigo)
        precio =  valorbusado.PRECIO
        document.getElementById("precio6").value = precio
        formatear("precio6",precio)
    }

    formatear("total6",precio*cantidad)

});
const prec6 = document.getElementById('precio6');
prec6.addEventListener('input', () => {
    let cantidad = parseFloat(document.getElementById("cantidad6").value.trim()) || 0;
    let precio = parseFloat(document.getElementById("precio6").value) || 0;


    formatear("total6",precio*cantidad)

});

// venta 3
const cant7 = document.getElementById('cantidad7');
cant7.addEventListener('input', () => {
    let codigo = document.getElementById("codigo7").value
    let cantidad = parseFloat(document.getElementById("cantidad7").value.trim()) || 0;
    let precio = parseFloat(document.getElementById("precio7").value) || 0;
    if (cantidad > 0){   
        let valorbusado = buscarProducto(codigo)
        precio =  valorbusado.PRECIO_MAYOREO
        document.getElementById("precio7").value = precio
        formatear("precio7",precio)
    }  else 
    {
        let valorbusado = buscarProducto(codigo)
        precio =  valorbusado.PRECIO
        document.getElementById("precio7").value = precio
        formatear("precio7",precio)
    }

    formatear("total7",precio*cantidad)

});
const prec7 = document.getElementById('precio7');
prec7.addEventListener('input', () => {
    let cantidad = parseFloat(document.getElementById("cantidad7").value.trim()) || 0;
    let precio = parseFloat(document.getElementById("precio7").value) || 0;


    formatear("total7",precio*cantidad)

});
