"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const comunidadBDModel_1 = require("../modelos/comunidadBDModel");
const usuarioBDModel_1 = require("../modelos/usuarioBDModel");
//crearemos el objeto con el cual realizaremos las peticiones
const rutasComunidad = (0, express_1.Router)();
//crear una comunidad
rutasComunidad.post('/crear', (request, response) => {
    //llenamos el objeto que crearemos comunidad
    const dataComunidad = {
        nombreComunidad: request.body.nombreComunidad,
        descripcion: request.body.descripcion,
        coordenadas: request.body.coordenadas
    };
    const idUsuario = request.body.usuario;
    //creamos comunidad
    comunidadBDModel_1.Comunidad.create(dataComunidad).then(comunidadBD => {
        //buscamos al usuario por id para traer sus comunidades
        //y agregar la nueva comunidad
        usuarioBDModel_1.Usuario.findOne({ _id: idUsuario }, (err, usuarioBD) => {
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
            var newRol = 1;
            arrayComunidades = usuarioBD.comunidad;
            arrayRol = usuarioBD.rol;
            arrayComunidades.push(comunidadBD._id);
            arrayRol.push(newRol);
            const dataUsuario = {
                _id: usuarioBD._id,
                rol: arrayRol,
                comunidad: arrayComunidades
            };
            //ahora que tenemos listo la data el usuario actualizaremos la info
            usuarioBDModel_1.Usuario.findByIdAndUpdate(idUsuario, dataUsuario, { new: true }, (err, usuarioBD) => {
                if (err)
                    throw err;
                if (!usuarioBD) {
                    return request.json({
                        ok: false,
                        mensaje: 'Usuario no encontrado'
                    });
                }
                response.json({
                    ok: true,
                    IdComunidad: comunidadBD._id,
                    nombre: comunidadBD.nombreComunidad,
                    usuario: usuarioBD
                });
            }); //fin actualizar usuario
        }); //fin a findOne usuario
        //fin a crear comunidad   
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
//crear una comunidad
rutasComunidad.post('/crearDefault', (request, response) => {
    const dataComunidad = {
        nombreComunidad: request.body.nombreComunidad,
        descripcion: request.body.descripcion,
        coordenadas: request.body.coordenadas
    };
    comunidadBDModel_1.Comunidad.create(dataComunidad).then(comunidadBD => {
        response.json({
            ok: true,
            IdComunidad: comunidadBD._id
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
