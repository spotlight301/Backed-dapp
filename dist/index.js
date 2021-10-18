"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const servidor_1 = __importDefault(require("./clases/servidor"));
const usuario_1 = __importDefault(require("./rutas/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const servidor = new servidor_1.default();
servidor.app.use(express_1.default.urlencoded({ extended: true }));
servidor.app.use(express_1.default.json());
//rutas de la aplicacion
servidor.app.use('/usuario', usuario_1.default);
//conecion a base de dato
mongoose_1.default.connect('mongodb://localhost:27017/veciRed', (err) => {
    if (err)
        throw err;
    console.log("Conectado exitosamente a BD1");
});
// main().catch(err => console.log(err));
// async function main() {
//     await mongoose.connect('mongodb://localhost:27017/veciRed').then( () =>
//      {console.log("Conectado exitosamente a BD")})
//   }
//levantamos el servidor
servidor.start(() => {
    console.log(`Servidor operativo en puerto ${servidor.port} `);
});
