"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avisos = void 0;
//definiremos la estructura de la tabla usuario que ocuparemos en BD
const mongoose_1 = require("mongoose");
const estructuraAvisos = new mongoose_1.Schema({
    fechaCreacion: {
        type: Date
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
    }
});
estructuraAvisos.pre('save', function (next) {
    this.fechaCreacion = new Date();
    next();
});
exports.Avisos = (0, mongoose_1.model)('Avisos', estructuraAvisos);
