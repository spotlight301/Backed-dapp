"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miembro = void 0;
//definiremos la estructura de la tabla usuario que ocuparemos en BD
const mongoose_1 = require("mongoose");
const estructuraMiembro = new mongoose_1.Schema({
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Los avisos deben ser realizados por un miembro']
    },
    comunidad: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comunidad'
    }
});
exports.Miembro = (0, mongoose_1.model)('Miembro', estructuraMiembro);
