"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
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
//Obtener comunidades por usuario
rutasComunidad.get('/', [autenticacion_1.verificaToken], (request, response) => {
    const comunidades = comunidadBDModel_1.Comunidad.find({ comunidad: request.usuario.comunidad })
        .populate({ path: 'comunidad' })
        .exec();
    response.json({
        comunidades,
        ok: true
    });
});
//exportamos el objeto para ocuparla en index
exports.default = rutasComunidad;
