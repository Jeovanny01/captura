//VENTA 1
function guardarTabla(){
    localStorage.setItem("nombreCliente", document.getElementById("nombreCliente4").value);
    localStorage.setItem("codCliente1", codCliente1);
    let numeroFilas = pedidoTabla.length+1; // Contar las filas actuales

   let nuevoPedido = {
    ARTICULO: document.getElementById("codigo4").value.toUpperCase(),        
    DESCRIPCION: document.getElementById("descripcion4").value, 
    CANTIDAD: parseFloat(document.getElementById("cantidad4").value), 
    PRECIO: parseFloat(document.getElementById("precio4").value), 
    TOTAL: parseFloat(document.getElementById("total4").value), 
    ACCION: numeroFilas + "Eliminar"
    };

// Agregar el nuevo pedido al arreglo
pedidoTabla.unshift(nuevoPedido);
localStorage.setItem('pedidoTabla', JSON.stringify(pedidoTabla));
let sumaTotal = 0;
let piezas = 0;

for (let fila of pedidoTabla) {
    sumaTotal += fila.TOTAL;
    piezas += fila.CANTIDAD;
}
let sumaFormateada = sumaTotal.toFixed(2)
// Función para sumar la columna total

document.getElementById("totalGeneral").textContent  = " Total $ " + sumaFormateada.toString()+"   UNDS: "+piezas.toString();
//document.getElementById("totalGeneral").value = formatear("totalGeneral",document.getElementById("totalGeneral").value)
generarTabla4(pedidoTabla);
document.getElementById('formVentas').reset();  // 'miFormulario' es el ID del formulario
document.getElementById("nombreCliente4").value =    localStorage.getItem("nombreCliente");
window.scrollTo(0, 0);
};
//VENTA2
function guardarTabla6(){
    localStorage.setItem("nombreCliente2",document.getElementById("nombreCliente6").value);
    localStorage.setItem("codCliente2", codCliente2);
    let numeroFilas = pedidoTabla2.length+1; // Contar las filas actuales

   let nuevoPedido = {
    ARTICULO: document.getElementById("codigo6").value.toUpperCase(),        
    DESCRIPCION: document.getElementById("descripcion6").value, 
    CANTIDAD: parseFloat(document.getElementById("cantidad6").value), 
    PRECIO: parseFloat(document.getElementById("precio6").value), 
    TOTAL: parseFloat(document.getElementById("total6").value), 
    ACCION: numeroFilas + "Eliminar"
    };

// Agregar el nuevo pedido al arreglo
pedidoTabla2.unshift(nuevoPedido);
localStorage.setItem('pedidoTabla2', JSON.stringify(pedidoTabla2));

let sumaTotal = 0;
let piezas = 0;

for (let fila of pedidoTabla2) {
    sumaTotal += fila.TOTAL;
    piezas += fila.CANTIDAD;
}
let sumaFormateada = sumaTotal.toFixed(2)
// Función para sumar la columna total

document.getElementById("totalGeneral6").textContent  = " Total $ " + sumaFormateada.toString()+"   UNDS: "+piezas.toString();
//document.getElementById("totalGeneral").value = formatear("totalGeneral",document.getElementById("totalGeneral").value)
generarTabla6(pedidoTabla2);
document.getElementById('formVentas2').reset();  // 'miFormulario' es el ID del formulario
document.getElementById("nombreCliente6").value =    localStorage.getItem("nombreCliente2");
window.scrollTo(0, 0);
};
//VENTA 3
function guardarTabla7(){
    localStorage.setItem("nombreCliente3", document.getElementById("nombreCliente7").value);
    localStorage.setItem("codCliente3", codCliente3);
    let numeroFilas = pedidoTabla3.length+1; // Contar las filas actuales

   let nuevoPedido = {
    ARTICULO: document.getElementById("codigo7").value.toUpperCase(),        
    DESCRIPCION: document.getElementById("descripcion7").value, 
    CANTIDAD: parseFloat(document.getElementById("cantidad7").value), 
    PRECIO: parseFloat(document.getElementById("precio7").value), 
    TOTAL: parseFloat(document.getElementById("total7").value), 
    ACCION: numeroFilas + "Eliminar"
    };

// Agregar el nuevo pedido al arreglo
try {
    

pedidoTabla3.unshift(nuevoPedido);
localStorage.setItem('pedidoTabla3', JSON.stringify(pedidoTabla3));
} catch (error) {
   console.log(error) ;
}
let sumaTotal = 0;
let piezas = 0;

for (let fila of pedidoTabla3) {
    sumaTotal += fila.TOTAL;
    piezas += fila.CANTIDAD;
}
let sumaFormateada = sumaTotal.toFixed(2)
// Función para sumar la columna total

document.getElementById("totalGeneral7").textContent  = " Total $ " + sumaFormateada.toString()+"   UNDS: "+piezas.toString();
//document.getElementById("totalGeneral").value = formatear("totalGeneral",document.getElementById("totalGeneral").value)
generarTabla7(pedidoTabla3);
document.getElementById('formVentas3').reset();  // 'miFormulario' es el ID del formulario
document.getElementById("nombreCliente7").value =    localStorage.getItem("nombreCliente3");
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

      
         cancelarPedido(1);
            alert('Cotizacion registrada con éxito No. ' + cot);
            button.disabled = false;
            if(empresa !="FUNNY") {descargarPdfCot(cot);}
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

async function  savePedidoNew(button) {

    let confirmacion = 
    confirm("¿Estás seguro de que deseas GUARDAR pedido?");
    
    if (!confirmacion) {
        return; // Sale de la función si el usuario cancela
    }
    button.disabled = true;
    document.getElementById("spinner2").style.display = "inline"; // Muestra el spinner
    let cot = 0
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    let nom = (document.getElementById("nombreCliente4")?.value ?? "").trim();
    let sumaTotal = 0;
    let nota = ""

     if (empresa ==="MMAG") {
        nota = prompt("Ingrese nombre de sucursal:");
        if (nota.trim() !== "") {
            nom = nom + " SUCURSAL: " + nota.trim();
        }
     }

for (let fila of pedidoTabla) {
    sumaTotal += fila.TOTAL;
}
if (sumaTotal == 0) {return}
document.getElementById("spinner2").style.display = "inline"; // Muestra el spinner
 // Envía los datos al backend mediante fetch
 fetch(url+"cotizacionesTotal", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
       
        accion:"INSERT", usuario:session.user|| "sa",  vendedor:session.vend || session.user ,  nombre:nom,  total:sumaTotal,cliente:codCliente1|| "CLIENTE",bd,empresa,jsonData:JSON.stringify(pedidoTabla) })
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
        cot =result.cotizacion;   
           document.getElementById("spinner2").style.display = "none";           
           cancelarPedido(1);
            button.disabled = false;
             alert('Cotizacion registrada con éxito No. ' + cot);
            if(empresa !="FUNNY") {descargarPdfCot(cot);}
        } else {
            const errorMessage = result.data[0].ErrorMessage;
            button.disabled = false;
            document.getElementById("spinner2").style.display = "none"; 
            console.error('Error:', errorMessage);
            alert('Hubo un error al registrar: ' + errorMessage);          
        }
    } catch (e) {
        button.disabled = false;
        document.getElementById("spinner2").style.display = "none"; 
        console.error('Error al procesar la respuesta JSON:', e);
        alert('Hubo un error al procesar la respuesta del servidor',e);

    }
}
)
.catch(error => {
    button.disabled = false;
    document.getElementById("spinner2").style.display = "none"; 
    console.error('Error al procesar la solicitud, verifica si tienes internet:', error);
    alert('Hubo un error al procesar la solicitud, verifica si tienes internet' + error);
    fetch("https://jsonblob.com/api/jsonBlob", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pedidoTabla)
    })
    .then(res => res.headers.get("Location"))
    .then(url => {
        // Muestra la URL en la caja de texto
        //const urlBox = document.getElementById("jsonUrlBox");
        //urlBox.value = url;
        //urlBox.select(); // Selecciona el texto automáticamente
        document.execCommand("copy"); // Copia al portapapeles (opcional)
        alert("Pedido guardado para depuración. URL copiada al portapapeles." + url.toString());
        
    })
    .catch(error => {
        console.error("Error al guardar el JSON:", error);
        alert("Error al guardar el pedido para depuración.");
    });

}) 
};

async function  savePedidoNew2(button) {
    let confirmacion = confirm("¿Estás seguro de que deseas GUARDAR pedido?");
    
    if (!confirmacion) {
        return; // Sale de la función si el usuario cancela
    }

    button.disabled = true;
    let cot = 0
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    let nom = (document.getElementById("nombreCliente6")?.value ?? "").trim();
    let sumaTotal = 0;

for (let fila of pedidoTabla2) {
    sumaTotal += fila.TOTAL;
}
if (sumaTotal == 0) {return}
document.getElementById("spinner3").style.display = "inline"; 
 // Envía los datos al backend mediante fetch
 fetch(url+"cotizacionesTotal", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
       
        accion:"INSERT", usuario:session.user,  vendedor:session.vendedor || session.user ,  nombre:nom,  total:sumaTotal,cliente:codCliente2|| "CLIENTE",bd,empresa,jsonData:JSON.stringify(pedidoTabla2) })
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
        cot =result.cotizacion; 
            document.getElementById("spinner3").style.display = "none";             
            cancelarPedido(1)
            button.disabled = false;
             alert('Cotizacion registrada con éxito No. ' + cot);
            if(empresa !="FUNNY") {descargarPdfCot(cot);}
        } else {
            const errorMessage = result.data[0].ErrorMessage;
            button.disabled = false;
            document.getElementById("spinner3").style.display = "none"; 
            console.error('Error:', errorMessage);
            alert('Hubo un error al registrar: ' + errorMessage);          
        }
    } catch (e) {
        button.disabled = false;
        document.getElementById("spinner3").style.display = "none"; 
        console.error('Error al procesar la respuesta JSON:', e);
        alert('Hubo un error al procesar la respuesta del servidor',e);
    }
}
)
.catch(error => {
    button.disabled = false;
    document.getElementById("spinner3").style.display = "none"; 
    console.error('Error al procesar la solicitud, verifica si tienes internet:', error);
    alert('Hubo un error al procesar la solicitud, verifica si tienes internet');
}) 
};

// document.getElementById('jsonInput').addEventListener('change', function(event) {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = function(e) {
//       try {
//         pedidoTabla3 = JSON.parse(e.target.result);
//         console.log("Pedido cargado:", pedidoTabla3);
//         alert("JSON cargado correctamente");
//         document.getElementById("btnGuardarPedido3").style.display = "flex";
//         document.getElementById("btnCancelarPedido3").style.display = "flex";
//         recuperarTabla3(pedidoTabla3);
//       } catch (err) {
//         alert("Error al leer el archivo JSON");
//       }
//     };
//     reader.readAsText(file);
//   });

async function  savePedidoNew3(button) {


    
   


    //  fetch("https://jsonblob.com/api/jsonBlob", {
    //      method: "POST",
    //      headers: {
    //          "Content-Type": "application/json"
    //      },
    //      body: JSON.stringify(pedidoTabla3)
    //  })
    //  .then(res => res.headers.get("Location"))
    //  .then(url => {
    //      // Muestra la URL en la caja de texto
    //      const urlBox = document.getElementById("jsonUrlBox");
    //      urlBox.value = url;
    //      urlBox.select(); // Selecciona el texto automáticamente
    //      document.execCommand("copy"); // Copia al portapapeles (opcional)
    //      alert("Pedido guardado para depuración. URL copiada al portapapeles.");
    //  })
    //  .catch(error => {
    //      console.error("Error al guardar el JSON:", error);
    //      alert("Error al guardar el pedido para depuración.");
    //  });
    


    let confirmacion = confirm("¿Estás seguro de que deseas GUARDAR pedido?");
    
    if (!confirmacion) {
        return; // Sale de la función si el usuario cancela
    }
    button.disabled = true;

    let cot = 0
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    let nom =(document.getElementById("nombreCliente7")?.value ?? "").trim();
    let sumaTotal = 0;

for (let fila of pedidoTabla3) {
    sumaTotal += fila.TOTAL;
}
if (sumaTotal == 0) {return}


document.getElementById("spinner4").style.display = "inline"; 
 // Envía los datos al backend mediante fetch
 fetch(url+"cotizacionesTotal", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
       
        accion:"INSERT", usuario:session.user,  vendedor:session.vendedor || session.user ,  nombre:nom,  total:sumaTotal,cliente:codCliente3|| "CLIENTE",bd,empresa,jsonData:JSON.stringify(pedidoTabla3) })
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
        cot =result.cotizacion;   
        document.getElementById("spinner4").style.display = "none";           
            cancelarPedido(1)
            button.disabled = false;
            alert('Cotizacion registrada con éxito No. ' + cot);
            if(empresa !="FUNNY") {descargarPdfCot(cot);}
        } else {
            const errorMessage = result.data[0].ErrorMessage;
            button.disabled = false;
            document.getElementById("spinner4").style.display = "none"; 
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
    document.getElementById("spinner4").style.display = "none"; 
    console.error('Error al procesar la solicitud, verifica si tienes internet:', error);
    alert('Hubo un error al procesar la solicitud, verifica si tienes internet');
}) 
};

async function  cancelarPedido(guardar = 0) {
let tab =   localStorage.getItem("ventana") || "venta1"
if (guardar ==0) {
let confirmacion = confirm("¿Estás seguro de que deseas borrar la VENTA?");

    if (!confirmacion) {
        return; // Sale de la función si el usuario cancela
    }
}

if (tab =="venta1") {
    localStorage.removeItem("nombreCliente"); 
    localStorage.removeItem("codCliente1"); 
    localStorage.removeItem("pedidoTabla"); 
    pedidoTabla =  [];
    document.getElementById("btnGuardarPedido").style.display = "none";
    document.getElementById("btnCancelarPedido").style.display = "none";
    document.getElementById("totalGeneral").textContent  =""
    document.getElementById("tablaDatos4").innerHTML = "";
    document.getElementById("nombreCliente4").value=""
    codCliente1="CLIENTE"
   
}
if (tab =="venta2") {
    localStorage.removeItem("nombreCliente2"); 
    localStorage.removeItem("codCliente2"); 
    localStorage.removeItem("pedidoTabla2"); 
    pedidoTabla2 =  [];
    document.getElementById("btnGuardarPedido2").style.display = "none";
    document.getElementById("btnCancelarPedido2").style.display = "none";
    document.getElementById("totalGeneral6").textContent  =""
    document.getElementById("tablaDatos6").innerHTML = "";
    document.getElementById("nombreCliente6").value=""
     codCliente2="CLIENTE"
}

if (tab =="venta3") {
    localStorage.removeItem("nombreCliente3"); 
    localStorage.removeItem("codCliente3"); 
    localStorage.removeItem("pedidoTabla3"); 
    pedidoTabla3 =  [];
    document.getElementById("btnGuardarPedido3").style.display = "none";
    document.getElementById("btnCancelarPedido3").style.display = "none";
    document.getElementById("totalGeneral7").textContent  =""
    document.getElementById("tablaDatos7").innerHTML = "";
    document.getElementById("nombreCliente7").value=""  
    codCliente3="CLIENTE"
}
};

function recuperarTabla(nuevoPedido){
    let sumaTotal = 0,piezas=0; 
    for (let fila of nuevoPedido) {
        sumaTotal += fila.TOTAL;
        piezas += fila.CANTIDAD;
    }
    let sumaFormateada = sumaTotal.toFixed(2)
    // Función para sumar la columna total
    
    document.getElementById("totalGeneral").textContent  = " Total $ " + sumaFormateada.toString()+"   UNDS: "+piezas.toString();
    //document.getElementById("totalGeneral").value = formatear("totalGeneral",document.getElementById("totalGeneral").value)
    generarTabla4(nuevoPedido);
    //document.getElementById('formVentas').reset();  // 'miFormulario' es el ID del formulario
    try {
        

    document.getElementById('nombreCliente4').value= localStorage.getItem("nombreCliente");
    codCliente1= localStorage.getItem("codCliente1");
    // window.scrollTo(0, 0);
    } catch (error) {
        console.log(error);        
    }
    };
   
    function recuperarTabla2(nuevoPedido){
    
        let sumaTotal = 0,piezas=0; 
        for (let fila of nuevoPedido) {
            sumaTotal += fila.TOTAL;
            piezas += fila.CANTIDAD;
        }
        let sumaFormateada = sumaTotal.toFixed(2)
        // Función para sumar la columna total
        
        document.getElementById("totalGeneral6").textContent  = " Total $ " + sumaFormateada.toString()+"   UNDS: "+piezas.toString();
           //document.getElementById("totalGeneral").value = formatear("totalGeneral",document.getElementById("totalGeneral").value)
       generarTabla6(nuevoPedido);
       //document.getElementById('formVentas').reset();  // 'miFormulario' es el ID del formulario
       document.getElementById('nombreCliente6').value= localStorage.getItem("nombreCliente2");
       codCliente2= localStorage.getItem("codCliente2");
    //    window.scrollTo(0, 0);
   };
   
   function recuperarTabla3(nuevoPedido){
    
    let sumaTotal = 0,piezas=0; 
    for (let fila of nuevoPedido) {
        sumaTotal += fila.TOTAL;
        piezas += fila.CANTIDAD;
    }
    let sumaFormateada = sumaTotal.toFixed(2)
    // Función para sumar la columna total
    
    document.getElementById("totalGeneral7").textContent  = " Total $ " + sumaFormateada.toString()+"   UNDS: "+piezas.toString();
       //document.getElementById("totalGeneral").value = formatear("totalGeneral",document.getElementById("totalGeneral").value)
           generarTabla7(nuevoPedido);
          // document.getElementById('formVentas').reset();  // 'miFormulario' es el ID del formulario
           document.getElementById('nombreCliente7').value= localStorage.getItem("nombreCliente3");
           codCliente3= localStorage.getItem("codCliente3");
        //    window.scrollTo(0, 0);
   };


//VENTA 1
const cant4 = document.getElementById('cantidad4');
cant4.addEventListener('input', () => {
    let codigo = document.getElementById("codigo4").value
    let cantidad = parseFloat(document.getElementById("cantidad4").value.trim()) || 0;
    let precio = parseFloat(document.getElementById("precio4").value) || 0;
    if( empresa =="FUNNY") {
    if (cantidad > 0){   
        let valorbusado = buscarProducto(codigo)
        precio =  valorbusado.PRECIO_MAYOREO || valorbusado.PRECIO ||  0;
        document.getElementById("precio4").value = precio
        formatear("precio4",precio)
    }  else 
    {
        let valorbusado = buscarProducto(codigo)
        precio =  valorbusado.PRECIO
        document.getElementById("precio4").value = precio
        formatear("precio4",precio)
    }
}
else
{
    precio = document.getElementById("precio4").value;
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
        precio = valorbusado.PRECIO_MAYOREO || valorbusado.PRECIO ||  0;
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
        precio =  valorbusado.PRECIO_MAYOREO || valorbusado.PRECIO ||  0;
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
