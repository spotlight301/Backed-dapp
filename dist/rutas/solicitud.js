"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const solicitudBDModel_1 = require("../modelos/solicitudBDModel");
//crearemos el objeto con el cual realizaremos las peticiones
const rutasSolicitud = (0, express_1.Router)();
//crear una solicitud
rutasSolicitud.post('/crear', [autenticacion_1.verificaToken], (request, response) => {
    const dataSolicitud = {
        usuario: request.usuario._id,
        comunidad: request.body._id,
        mensaje: request.body.mensaje
    };
    var existeSolicitud = {};
    var codigo = 0;
    existeSolicitud = solicitudBDModel_1.Solicitud.find({ comunidad: dataSolicitud.comunidad })
        .exec();
    if (existeSolicitud == {} && codigo == 0) {
        solicitudBDModel_1.Solicitud.create(dataSolicitud).then(solicitudBD => {
            response.json({
                ok: true,
                solicitudBD
            });
        });
    }
    else {
        response.json({
            ok: false,
            codigo: 1
        });
    }
});
//exportamos el objeto para ocuparla en index
exports.default = rutasSolicitud;
