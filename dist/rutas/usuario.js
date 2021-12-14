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
const rutasUsuario = (0, express_1.Router)();
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
                rol: usuarioBD.rol[0],
                comunidad: usuarioBD.comunidad[0]
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
    request.body.comunidad = '61ac3ce9c27143f6fe782cf0';
    request.body.rol = 2;
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
rutasUsuario.get('/comunidad', [autenticacion_1.verificaToken], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const comunidades = yield usuarioBDModel_1.Usuario.findById(request.usuario._id)
        .populate({ path: 'comunidad' })
        .select('-password')
        .exec();
    response.json({
        ok: true,
        comunidades
    });
}));
//actualizar Token
rutasUsuario.post('/updateToken', (request, response) => {
    const data = {
        usuario: request.body.usuario,
        posicion: request.body.posicion
    };
    usuarioBDModel_1.Usuario.findOne({ _id: data.usuario }, (err, usuarioBD) => {
        if (err)
            throw err;
        if (!usuarioBD) {
            return response.json({
                ok: false,
                mensaje: 'ID incorrecta'
            });
        }
        const usuarioToken = token_1.default.getJwtToken({
            _id: usuarioBD._id,
            nombre: usuarioBD.nombre,
            email: usuarioBD.email,
            imagenPerfil: usuarioBD.imagenPerfil,
            rol: usuarioBD.rol[data.posicion],
            comunidad: usuarioBD.comunidad[data.posicion]
        });
        response.json({
            ok: true,
            token: usuarioToken
        });
    });
});
//funcion para remover una comunidad de la data de usuario
rutasUsuario.post('/abandonarComunidad', [autenticacion_1.verificaToken], (request, response) => {
    const comunidadBorrar = {
        id: request.body._id
    };
    //encontramos al usuario para obtener sus comunidades y roles
    usuarioBDModel_1.Usuario.findById(request.usuario._id, (err, usuarioBD) => {
        if (err)
            throw err;
        if (!usuarioBD) {
            return response.json({
                ok: false,
                mensaje: 'ID incorrecta'
            });
        }
        //pasamos las comunidades y los roles a dos arrays para trabajarlos mejor
        var arrayComunidades = [];
        var arrayRol = [];
        arrayComunidades = usuarioBD.comunidad;
        arrayRol = usuarioBD.rol;
        var usuarioToken;
        var auxToken = false;
        //removemos data de ambos Arrays
        let index = arrayComunidades.indexOf(comunidadBorrar.id);
        if (index != -1) {
            arrayComunidades.splice(index, 1);
        }
        arrayRol.splice(index, 1);
        const dataUsuario = {
            rol: arrayRol,
            comunidad: arrayComunidades
        };
        //actualizamos el usuario
        usuarioBDModel_1.Usuario.findByIdAndUpdate(usuarioBD._id, dataUsuario, { new: true }, (err, usuarioUpdate) => {
            if (err)
                throw err;
            if (!usuarioUpdate) {
                return request.json({
                    ok: false,
                    mensaje: 'Usuario no encontrado'
                });
            }
            if (request.usuario.comunidad == comunidadBorrar.id) {
                auxToken = true;
                usuarioToken = token_1.default.getJwtToken({
                    _id: usuarioBD._id,
                    nombre: usuarioBD.nombre,
                    email: usuarioBD.email,
                    imagenPerfil: usuarioBD.imagenPerfil,
                    rol: usuarioBD.rol[0],
                    comunidad: usuarioBD.comunidad[0]
                });
            }
            if (auxToken) {
                response.json({
                    ok: true,
                    token: usuarioToken
                });
            }
            else {
                response.json({
                    ok: true
                });
            }
        });
    });
});
rutasUsuario.get('/arrayComunidad', [autenticacion_1.verificaToken], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const comunidades = yield usuarioBDModel_1.Usuario.findById(request.usuario._id)
        .select('comunidad')
        .exec();
    response.json({
        ok: true,
        comunidades
    });
}));
exports.default = rutasUsuario;
