const fetch = require('node-fetch');

exports.handler = async (event) => {
    const url = "http://131.100.140.45:8082/ApiDatos/reporteCrystal";
    const body = event.body;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
