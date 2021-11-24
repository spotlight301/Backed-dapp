"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avisos = void 0;
//definiremos la estructura de la tabla usuario que ocuparemos en BD
const mongoose_1 = require("mongoose");
const estructuraAvisos = new mongoose_1.Schema({
    fechaCreacion: {
        type: String
    },
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    imagenAviso: [{
            type: String,
        }],
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Los avisos deben ser realizados por un miembro']
    },
    comunidad: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comunidad'
    },
    tipoAviso: {
        type: Number,
        default: 4
    },
    estadoAviso: {
        type: Number,
        default: 1
    }
});
estructuraAvisos.pre('save', function (next) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    this.fechaCreacion = dd + '/' + mm + '/' + yyyy;
    //this.fechaCreacion = new Date();
    next();
});
exports.Avisos = (0, mongoose_1.model)('Avisos', estructuraAvisos);
