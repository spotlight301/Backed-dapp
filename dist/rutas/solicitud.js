"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const solicitudBDModel_1 = require("../modelos/solicitudBDModel");
const usuarioBDModel_1 = require("../modelos/usuarioBDModel");
//crearemos el objeto con el cual realizaremos las peticiones
const rutasSolicitud = (0, express_1.Router)();
//crear una solicitud
rutasSolicitud.post('/crear', [autenticacion_1.verificaToken], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    //INICIO VALIDACIONES BACKEND
    var caracteres = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!?¿@-_.,/()= ]{1,250})+$/g;
    if (caracteres.test(request.body.mensaje) == false) {
        return response.json({
            ok: false,
            mensaje: 'Caracteres invalidos en mensaje'
        });
    }
    if (request.body.mensaje.length > 250) {
        return response.json({
            ok: false,
            mensaje: 'Error en título'
        });
    }
    //FIN VALIDACIONES BACKEND
    const dataSolicitud = {
        usuario: request.usuario._id,
        comunidad: request.body._id,
        mensaje: request.body.mensaje
    };
    var existeSolicitud = {};
    var codigo = 0;
    var len = 10;
    /* codigo = 0 => se puede crear
       codigo = 1 => ya existe solicitud en BD
       codigo = 2 => usuario ya pertenece a esa comunidad
    */
    //preguntamos si existe ya la solicitud en BD
    existeSolicitud = yield solicitudBDModel_1.Solicitud.find({ comunidad: dataSolicitud.comunidad,
        usuario: dataSolicitud.usuario })
        .exec();
    len = Object.keys(existeSolicitud).length;
    //verificaremos si es que usuario ya pertenece a esa comunidad
    // perteneceComunidad = await Usuario.findOne({_id: request.usuario._id}, 
    //                                             {
    //                                              "comunidad" :1})
    // arrayComunidades.push(perteneceComunidad.comunidad);
    // arrayRol.push(perteneceComunidad.rol);
    // found = dataSolicitud.comunidad;
    // const index = arrayComunidades.indexOf(dataSolicitud.comunidad);
    //     if (index != -1) {
    //         codigo = 2;
    //         entro = true;
    //     }
    if (len != 0) {
        codigo = 1;
    }
    if (codigo == 1) {
        response.json({
            ok: false
        });
    }
    if (codigo == 0) {
        solicitudBDModel_1.Solicitud.create(dataSolicitud).then(solicitudBD => {
            response.json({
                ok: true
            });
        });
    }
}));
rutasSolicitud.get('/', [autenticacion_1.verificaToken], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const solicitudes = yield solicitudBDModel_1.Solicitud.find({ comunidad: request.usuario.comunidad })
        .populate("usuario", { nombre: 1 })
        .populate("comunidad", { nombreComunidad: 1 })
        .exec();
    response.json({
        solicitudes,
        ok: true
    });
}));
//funcion para eliminar la solicitud
rutasSolicitud.post('/eliminar', (request, response) => {
    solicitudBDModel_1.Solicitud.deleteOne({ _id: request.body.idSolicitud }, (err, solicitudDeleted) => {
        if (err)
            throw err;
        if (!solicitudDeleted) {
            return request.json({
                ok: false,
                mensaje: 'no se elimino'
            });
        }
        response.json({
            ok: true
        });
    });
});
//funcionar para aceptar una solicitud
rutasSolicitud.post('/aceptar', (request, response) => {
    const dataSolicitud = {
        idComunidad: request.body.idComunidad,
        idUsuario: request.body.idUsuario,
        idSolicitud: request.body.idSolicitud
    };
    usuarioBDModel_1.Usuario.findOne({ _id: dataSolicitud.idUsuario }, (err, usuarioBD) => {
        if (err)
            throw err;
        if (!usuarioBD) {
            return response.json({
                ok: false,
                mensaje: 'ID incorrecta'
            });
        }
        //inicializamos array en 0 para pasarle los valores y actualizarlos
        var arrayComunidades = [];
        var arrayRol = [];
        var newRol = 2;
        arrayComunidades = usuarioBD.comunidad;
        arrayRol = usuarioBD.rol;
        arrayComunidades.push(dataSolicitud.idComunidad);
        arrayRol.push(newRol);
        //pasamos lo valores actualizados a un obeto
        //para actualizar data of user
        const dataUsuario = {
            _id: usuarioBD._id,
            rol: arrayRol,
            comunidad: arrayComunidades
        };
        //ahora que tenemos listo la data el usuario actualizaremos la info
        usuarioBDModel_1.Usuario.findByIdAndUpdate(dataSolicitud.idUsuario, dataUsuario, { new: true }, (err, updatedUBD) => {
            if (err)
                throw err;
            if (!updatedUBD) {
                return request.json({
                    ok: false,
                    mensaje: 'Usuario no encontrado'
                });
            }
            solicitudBDModel_1.Solicitud.deleteOne({ _id: dataSolicitud.idSolicitud }, (err, solicitudDeleted) => {
                if (err)
                    throw err;
                if (!solicitudDeleted) {
                    return request.json({
                        ok: false,
                        mensaje: 'no se elimino'
                    });
                }
                response.json({
                    ok: true,
                    dataSolicitud,
                    usuarioBD,
                    dataUsuario,
                    updatedUBD
                });
            }); //fin deleteOne
        }); //fin actualizar usuario
    }); //fin findOne
});
rutasSolicitud.get('/length', [autenticacion_1.verificaToken], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const solicitudes = yield solicitudBDModel_1.Solicitud.find({ comunidad: request.usuario.comunidad })
        .populate("usuario", { nombre: 1 })
        .populate("comunidad", { nombreComunidad: 1 })
        .exec();
    var length = solicitudes.length;
    response.json({
        length
    });
}));
//exportamos el objeto para ocuparla en index
exports.default = rutasSolicitud;
