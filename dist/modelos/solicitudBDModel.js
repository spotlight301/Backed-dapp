"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solicitud = void 0;
const mongoose_1 = require("mongoose");
const estructuraSolicitud = new mongoose_1.Schema({
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Las solicitudes deben incluir un usuario']
    },
    comunidad: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comunidad',
        required: [true, 'Las solicitudes deben incluir una comunidad']
    },
    mensaje: {
        type: String
    }
});
exports.Solicitud = (0, mongoose_1.model)('Solicitud', estructuraSolicitud);
