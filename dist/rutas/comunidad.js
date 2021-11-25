"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comunidadBDModel_1 = require("../modelos/comunidadBDModel");
//crearemos el objeto con el cual realizaremos las peticiones
const rutasComunidad = express_1.Router();
//crear una comunidad
rutasComunidad.post('/crear', (request, response) => {
    const dataComunidad = { nombreComunidad: request.body.nombreComunidad };
    comunidadBDModel_1.Comunidad.create(dataComunidad).then(comunidadBD => {
        response.json({
            ok: true,
            nombreComunidad: comunidadBD
        });
    }).catch(err => {
        response.json({
            ok: false,
            err
        });
    });
});
//exportamos el objeto para ocuparla en index
exports.default = rutasComunidad;
