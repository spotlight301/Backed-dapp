"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//objeto que reconocera express para escribir en el URL direccione que usaremos
const rutasUsuario = (0, express_1.Router)();
rutasUsuario.get('/prueba', (request, response) => {
    response.json({
        ok: true,
        mensaje: 'wena wena'
    });
});
exports.default = rutasUsuario;
