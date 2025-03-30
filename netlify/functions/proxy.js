const fetch = require('node-fetch');
const fetch2 = require('node-fetch');
exports.handler = async (event) => {
    const url = "http://131.100.140.45:8082/ApiDatos/reporteCrystalCoti";
    const body = JSON.parse(event.body);  // Si el cuerpo es un JSON stringificado

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",  // Permite solicitudes desde cualquier origen
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body,
        });

        const data = await response.text();

        return {
            statusCode: response.status,
            body: data,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: "Error en el proxy: " + error.message,
        };
    }
};
