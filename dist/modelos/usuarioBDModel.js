"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
//definiremos la estructura de la tabla usuario que ocuparemos en BD
const mongoose_1 = require("mongoose");
const estructuraUsuario = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    fechaNacimiento: {
        type: Date,
        required: [true, 'la fecha de nacimiento es obligatoria']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo electronico es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La clave es obligatoria']
    },
    imagenPerfil: {
        type: String,
        default: 'av-3.png'
    },
    rol: [{
            type: Number,
            default: 1
        }],
    comunidad: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Comunidad'
        }]
});
estructuraUsuario.method('checkPass', function (password = '') {
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
exports.Usuario = (0, mongoose_1.model)('Usuario', estructuraUsuario);
