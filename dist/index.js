"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const servidor_1 = __importDefault(require("./clases/servidor"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const usuario_1 = __importDefault(require("./rutas/usuario"));
const avisos_1 = __importDefault(require("./rutas/avisos"));
const comunidad_1 = __importDefault(require("./rutas/comunidad"));
const acuerdos_1 = __importDefault(require("./rutas/acuerdos"));
const servidor = new servidor_1.default();
servidor.app.use(express_1.default.urlencoded({ extended: true }));
servidor.app.use(express_1.default.json());
//configuracion para obtener los archivos que subimos 
servidor.app.use(express_fileupload_1.default({
// useTempFiles : true,
//tempFileDir : '/tmp/'
}));
//Configuración de CORS para que el servidor no bloquee peticiones hTTp de origin !=
servidor.app.use(cors_1.default({ origin: true, credentials: true }));
//rutas de la aplicacion
servidor.app.use('/usuario', usuario_1.default);
servidor.app.use('/avisos', avisos_1.default);
servidor.app.use('/comunidad', comunidad_1.default);
servidor.app.use('/acuerdos', acuerdos_1.default);
//conexion a base de datos de verdad
mongoose_1.default.connect('mongodb+srv://veciUser:veciPass-1x7@vecired.6lbpq.mongodb.net/veciRed?retryWrites=true&w=majority', (err) => {
    if (err)
        throw err;
    console.log("Conectado exitosamente a BD1");
});
//mongo "mongodb://vecired-shard-00-00.6lbpq.mongodb.net:27017,vecired-shard-00-01.6lbpq.mongodb.net:27017,vecired-shard-00-02.6lbpq.mongodb.net:27017/veciRed?replicaSet=atlas-88bqpg-shard-0" --ssl --authenticationDatabase admin --username veciUser --password veciPass-1x7
//conecion a base de dato local
// mongoose.connect('mongodb://localhost:27017/veciRed',
//                 (err) => 
//                 {
//                     if(err) throw err;
//                     console.log("Conectado exitosamente a BD1");
//                 })
// main().catch(err => console.log(err));
// async function main() {
//     await mongoose.connect('mongodb://localhost:27017/veciRed').then( () =>
//      {console.log("Conectado exitosamente a BD")})
//   }
//levantamos el servidor
servidor.start(() => {
    console.log(`Servidor operativo en puerto ${servidor.port} `);
});
