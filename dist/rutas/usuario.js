"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioBDModel_1 = require("../modelos/usuarioBDModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../clases/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
//objeto que reconocera express para escribir en el URL direccione que usaremos
const rutasUsuario = express_1.Router();
//function para autentificarse
rutasUsuario.post('/login', (request, response) => {
    usuarioBDModel_1.Usuario.findOne({ email: request.body.email }, (err, usuarioBD) => {
        if (err)
            throw err;
        if (!usuarioBD) {
            return response.json({
                ok: false,
                mensaje: 'Sus credenciales de acceso no son correctas'
            });
        }
        if (usuarioBD.checkPass(request.body.password)) {
            const Usuariotoken = token_1.default.getJwtToken({
                _id: usuarioBD._id,
                nombre: usuarioBD.nombre,
                email: usuarioBD.email,
                imagenPerfil: usuarioBD.imagenPerfil,
                rol: usuarioBD.rol,
                comunidad: usuarioBD.comunidad
            });
            response.json({
                ok: true,
                token: Usuariotoken
            });
        }
        else {
            response.json({
                ok: false,
                mensaje: 'Sus credenciales de acceso no son correctas'
            });
        }
    });
});
//function para crear un usuario
rutasUsuario.post('/crear', (request, response) => {
    const dataUsuario = {
        nombre: request.body.nombre,
        fechaNacimiento: request.body.fechaNacimiento,
        email: request.body.email,
        password: bcrypt_1.default.hashSync(request.body.password, 10),
        imagenPerfil: request.body.imagenPerfil,
        rol: request.body.rol,
        comunidad: request.body.comunidad
    };
    usuarioBDModel_1.Usuario.create(dataUsuario).then(usuarioBD => {
        const Usuariotoken = token_1.default.getJwtToken({
            _id: usuarioBD._id,
            nombre: usuarioBD.nombre,
            email: usuarioBD.email,
            imagenPerfil: usuarioBD.imagenPerfil,
            rol: usuarioBD.rol,
            comunidad: usuarioBD.comunidad
        });
        response.json({
            ok: true,
            token: Usuariotoken
        });
    }).catch(err => {
        response.json({
            ok: false,
            err
        });
    });
});
//actualizar datos del usuario
rutasUsuario.post('/actualizar', autenticacion_1.verificaToken, (request, response) => {
    const dataUsuario = {
        nombre: request.body.nombre || request.usuario.nombre,
        fechaNacimiento: request.body.fechaNacimiento || request.usuario.fechaNacimiento,
        email: request.body.email || request.usuario.email,
        password: request.body.password || request.usuario.password,
        imagenPerfil: request.body.imagenPerfil || request.usuario.imagenPerfil,
    };
    usuarioBDModel_1.Usuario.findByIdAndUpdate(request.usuario._id, dataUsuario, { new: true }, (err, usuarioBD) => {
        if (err)
            throw err;
        if (!usuarioBD) {
            return request.json({
                ok: false,
                mensaje: 'Usuario no encontrado'
            });
        }
        const Usuariotoken = token_1.default.getJwtToken({
            _id: usuarioBD._id,
            nombre: usuarioBD.nombre,
            email: usuarioBD.email,
            imagenPerfil: usuarioBD.imagenPerfil,
            rol: usuarioBD.rol
        });
        response.json({
            ok: true,
            token: Usuariotoken
        });
    });
    // response.json({
    //     ok: true,
    //     usuario: request.usuario
    // })
});
rutasUsuario.get('/', [autenticacion_1.verificaToken], (request, response) => {
    const usuario = request.usuario;
    response.json({
        ok: true,
        usuario
    });
});
exports.default = rutasUsuario;
