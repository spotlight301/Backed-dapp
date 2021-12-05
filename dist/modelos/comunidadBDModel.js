"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comunidad = void 0;
//definiremos la estructura de la tabla usuario que ocuparemos en BD
const mongoose_1 = require("mongoose");
const estructuraComunidad = new mongoose_1.Schema({
    nombreComunidad: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la comunidad es obligatorio'],
        default: 'Comunidad VeciRed'
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción de la comunidad es obligatoria'],
        default: 'Comunidad inicial administrada por los creadores de veciRed'
    },
    coordenadas: {
        type: String
    },
    region: {
        type: String
    },
    comuna: {
        type: String
    }
});
exports.Comunidad = (0, mongoose_1.model)('Comunidad', estructuraComunidad);
