const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');

//crear el servidor de exprees
const app = express();

//BAse de datos
dbConnection();

//rutas

//configurar cors
app.use(cors());

//req lo que se solicita, info de los headers
// es lo que neustro servidor responde al cliente
//Estos dos son los parametros del callback
app.get('/', (req, resp) => {

    resp.json({
        ok: true,
        msg: 'Hola mundo'
    });
});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
})