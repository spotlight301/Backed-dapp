"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Acuerdos = void 0;
const mongoose_1 = require("mongoose");
const estructuraAcuerdos = new mongoose_1.Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    fecha: {
        type: String
    },
    hora: {
        type: String
    },
    duracion: {
        type: Number
    },
    fechaLanzada: {
        type: Number
    },
    imagenAcuerdo: [{
            type: String
        }],
    opciones: [{
            titulo: {
                type: String,
                //required: [true, 'El titulo es obligatorio']
            },
            descripcion: {
                type: String,
                //required: [true, 'La descripcion es obligatoria']
            },
            votos: {
                type: Number
            }
        }],
    votantes: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Usuario'
        }],
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario'
        //required: [true, 'Los avisos deben ser realizados por un miembro']
    },
    comunidad: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comunidad'
        //required: [true, 'Los acuerdos deben pertenecer a una comunidad']
    },
    estado: {
        type: Number
    }
});
exports.Acuerdos = (0, mongoose_1.model)('Acuerdos', estructuraAcuerdos);
