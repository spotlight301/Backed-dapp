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
const acuerdosBDModel_1 = require("../modelos/acuerdosBDModel");
const file_system_1 = __importDefault(require("../clases/file-system"));
const rutasAcuerdos = express_1.Router();
const fileSystem = new file_system_1.default();
//Crear acuerdo
rutasAcuerdos.post('/', [autenticacion_1.verificaToken], (request, response) => {
    const body = request.body;
    body.usuario = request.usuario._id;
    body.comunidad = request.usuario.comunidad;
    body.estado = 1;
    const imagenes = fileSystem.imagenesTempHaciaAvisos(body.usuario);
    body.imagenAcuerdo = imagenes;
    acuerdosBDModel_1.Acuerdos.create(body).then((acuerdosDB) => __awaiter(void 0, void 0, void 0, function* () {
        //await acuerdosDB.populate('usuario').execPopulate();
        yield acuerdosDB.populate({ path: 'usuario', select: '-password' });
        yield acuerdosDB.populate({ path: 'comunidad' });
        response.json({
            ok: true,
            acuerdo: acuerdosDB
        });
    })).catch(err => {
        response.json(err);
    });
});
//Obtener acuerdo
rutasAcuerdos.get('/', [autenticacion_1.verificaToken], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(request.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const acuerdosPublicados = yield acuerdosBDModel_1.Acuerdos.find({ comunidad: request.usuario.comunidad, estado: { "$in": [1, 2] } })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate({ path: 'usuario', select: '-password' })
        .populate({ path: 'comunidad' })
        .exec();
    response.json({
        ok: true,
        pagina,
        acuerdosPublicados
    });
}));
//subir imagenes para acuerdos
rutasAcuerdos.post('/upload', [autenticacion_1.verificaToken], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    if (!request.files) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Ningun archivo ha sido registrado'
        });
    }
    const archivo = request.files.imagenAcuerdo;
    if (!archivo) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Ningun archivo ha sido registrado de imagen'
        });
    }
    if (!archivo.mimetype.includes('image')) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Error, archivo ingresado no es una imagen'
        });
    }
    yield fileSystem.guardarImagenTemp(archivo, request.usuario._id);
    response.json({
        ok: true,
        archivo: archivo.mimetype
    });
}));
rutasAcuerdos.get('/imagenAcuerdo/:idUsuario/:imgAcuerdo', (request, response) => {
    const idUsuario = request.params.idUsuario;
    const imgAcuerdo = request.params.imgAcuerdo;
    const rutaFotoBD = fileSystem.getFotoUrl(idUsuario, imgAcuerdo);
    response.sendFile(rutaFotoBD);
});
//actualizar acuerdo
rutasAcuerdos.post('/actualizar', [autenticacion_1.verificaToken], (request, response) => {
    const dataAcuerdo = {
        titulo: request.body.titulo,
        descripcion: request.body.descripcion,
        fecha: request.body.fecha,
        hora: request.body.hora,
        duracion: request.body.duracion,
        fechaLanzada: request.body.fechaLanzada,
        imagenAcuerdo: request.body.imagenAcuerdo,
        opciones: request.body.opciones,
        estado: request.body.estado
    };
    acuerdosBDModel_1.Acuerdos.findByIdAndUpdate(request.body._id, dataAcuerdo, { new: true }, (err, acuerdoDB) => {
        if (err)
            throw err;
        if (!acuerdoDB) {
            return response.json({
                ok: false,
                mensaje: 'No existe el acuerdo solicitado'
            });
        }
        response.json({
            ok: true,
            acuerdo: acuerdoDB
        });
    });
});
exports.default = rutasAcuerdos;
