"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificaToken = void 0;
const token_1 = __importDefault(require("../clases/token"));
const verificaToken = (request, response, next) => {
    const tokenUsuario = request.get('Utoken') || '';
    token_1.default.checkToken(tokenUsuario).then((decoded) => {
        request.usuario = decoded.usuario;
        next();
    }).catch(err => {
        response.json({
            ok: false,
            mensaje: 'Token invalido'
        });
    });
};
exports.verificaToken = verificaToken;
