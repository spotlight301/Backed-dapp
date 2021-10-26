"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class FileSystem {
    constructor() { }
    ;
    guardarImagenTemp(file, idUsuario) {
        return new Promise((resolve, reject) => {
            const path = this.crearCarpetaUsuario(idUsuario);
            // console.log(file.name);
            // console.log(path);
            file.mv(`${path}/${file.name}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    crearCarpetaUsuario(idUsuario) {
        const rutaUsuario = path_1.default.resolve(__dirname, '../imagenesAvisos/', idUsuario);
        const rutaUsuarioTemporal = rutaUsuario + '/temp';
        const existe = fs_1.default.existsSync(rutaUsuario);
        //comprobamos si es que existe o no la carpeta del usuario en donde se almacenaran las imagenes de los avisos
        if (!existe) {
            fs_1.default.mkdirSync(rutaUsuario);
            fs_1.default.mkdirSync(rutaUsuarioTemporal);
        }
        return rutaUsuarioTemporal;
    }
    imagenesTempHaciaAvisos(idUsuario) {
        const rutaUsuarioTemporal = path_1.default.resolve(__dirname, '../imagenesAvisos/', idUsuario, 'temp');
        const rutaUsuarioAvisos = path_1.default.resolve(__dirname, '../imagenesAvisos/', idUsuario, 'avisos');
        if (!fs_1.default.existsSync(rutaUsuarioTemporal)) {
            return [];
        }
        if (!fs_1.default.existsSync(rutaUsuarioAvisos)) {
            fs_1.default.mkdirSync(rutaUsuarioAvisos);
        }
        const imagenTemp = this.obtenerImagenesTemp(idUsuario);
        imagenTemp.forEach(imagen => {
            fs_1.default.renameSync(`${rutaUsuarioTemporal}/${imagen}`, `${rutaUsuarioAvisos}/${imagen}`);
        });
        return imagenTemp;
    }
    obtenerImagenesTemp(idUsuario) {
        const rutaUsuarioTemporal = path_1.default.resolve(__dirname, '../imagenesAvisos/', idUsuario, 'temp');
        return fs_1.default.readdirSync(rutaUsuarioTemporal) || [];
    }
    getFotoUrl(idUsuario, imgAviso) {
        const rutaFotoBD = path_1.default.resolve(__dirname, '../imagenesAvisos', idUsuario, 'avisos', imgAviso);
        const existe = fs_1.default.existsSync(rutaFotoBD);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/noDisponible.jpg');
        }
        return rutaFotoBD;
    }
}
exports.default = FileSystem;
