"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comunidad = void 0;
//definiremos la estructura de la tabla usuario que ocuparemos en BD
const mongoose_1 = require("mongoose");
const estructuraComunidad = new mongoose_1.Schema({
    nombreComunidad: {
        type: String,
        required: [true, 'El nombre de la comunidad es obligatorio'],
        default: 'Default Comunity '
    }
});
exports.Comunidad = mongoose_1.model('Comunidad', estructuraComunidad);
