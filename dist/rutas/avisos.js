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
const autenticacion_1 = require("../middlewares/autenticacion");
const avisosBDModel_1 = require("../modelos/avisosBDModel");
const file_system_1 = __importDefault(require("../clases/file-system"));
const fileSystem = new file_system_1.default();
const rutasAvisos = express_1.Router();
//crear un nuevo aviso
rutasAvisos.post('/', [autenticacion_1.verificaToken], (request, response) => {
    //la constante body almacenara el contenido que se envia desde la pagina al servidor
    //posteriormente sera esta informacion que enviaremos a traves de la funcion create para insertar en la BD
    const body = request.body;
    body.usuario = request.usuario._id;
    body.comunidad = request.usuario.comunidad;
    //body.Miembro.comunidad = 'test3';
    const imagenes = fileSystem.imagenesTempHaciaAvisos(request.usuario._id);
    body.imagenAviso = imagenes;
    //a través de create se nos inserta la informacion en la BD
    avisosBDModel_1.Avisos.create(body).then((avisosBD) => __awaiter(void 0, void 0, void 0, function* () {
        //avisosBD.populate('usuario').execPopulate();
        yield avisosBD.populate({ path: 'usuario', select: '-password' });
        yield avisosBD.populate({ path: 'comunidad' });
        response.json({
            ok: true,
            aviso: avisosBD
        });
    })).catch(err => {
        response.json(err);
    });
});
//obtener avisos 
rutasAvisos.get('/', [autenticacion_1.verificaToken], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    //a traves de la variable pagina y skip vamos iterando nuestros avisos de 10 en 10 desde atras hacia adelante
    let pagina = Number(request.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const avisosPublicados = yield avisosBDModel_1.Avisos.find({ comunidad: request.usuario.comunidad })
        .sort({ _id: -1 }) //de esta manera le decimos que parta del ultimo registr
        .skip(skip)
        .limit(10)
        .populate({ path: 'usuario', select: '-password' })
        .populate({ path: 'comunidad' })
        .exec();
    response.json({
        ok: true,
        pagina,
        avisosPublicados
    });
}));
//subir imagenes a BD
rutasAvisos.post('/subirImagen', [autenticacion_1.verificaToken], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    //podemos acceder a la propiedad files gracias a fileUpload :p
    if (!request.files) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Ningun archivo ha sido registrado'
        });
    }
    const archivo = request.files.imagenAviso;
    //validacion para que el archivo no venga vacio
    if (!archivo) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Ningun archivo ha sido registrado (imagen)'
        });
    }
    //validacion para que solo se suban imagenes
    if (!archivo.mimetype.includes('image')) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Error, archivo ingresado no es imagen'
        });
    }
    yield fileSystem.guardarImagenTemp(archivo, request.usuario._id);
    response.json({
        ok: true,
        archivo: archivo.mimetype
    });
}));
//al definir de esta manera la ruta de nuestro archivo, estamos obligando al servicio
//a enviar las variables "idUsuario" y "imgAviso"
rutasAvisos.get('/imagenAviso/:idUsuario/:imgAviso', (request, response) => {
    const idUsuario = request.params.idUsuario;
    const imgAviso = request.params.imgAviso;
    const rutaFotoBD = fileSystem.getFotoUrl(idUsuario, imgAviso);
    response.sendFile(rutaFotoBD);
});
exports.default = rutasAvisos;
