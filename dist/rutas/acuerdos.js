"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const acuerdosBDModel_1 = require("../modelos/acuerdosBDModel");
const file_system_1 = __importDefault(require("../clases/file-system"));
const rutasAcuerdos = express_1.Router();
const fileSystem = new file_system_1.default();
//Crear acuerdo
rutasAcuerdos.post('/', [autenticacion_1.verificaToken], (request, response) => {
    const body = request.body;
    body.usuario = request.usuario._id;
    body.comunidad = request.usuario.comunidad;
    body.estado = 1;
    const imagenes = fileSystem.imagenesTempHaciaAvisos(body.usuario);
    body.imagenAcuerdo = imagenes;
    //Validaciones
    //Validaciónes en titulo
    var caracteresTitulo = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
    if (caracteresTitulo.test(body.titulo) == false) {
        return response.json({
            ok: false,
            mensaje: 'El título del acuerdo no permite tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
        });
    }
    //Validación fecha vacia
    if (body.fecha == null) {
        return response.json({
            ok: false,
            mensaje: 'Debe seleccionar un día'
        });
    }
    /* var currentDateObj = new Date();
    var numberOfMlSeconds = currentDateObj.getTime();
    var addMlSeconds = 180 * 60000;
    var newDateObj = new Date(numberOfMlSeconds - addMlSeconds);
    console.log(newDateObj); */
    //const today = new Date();
    const yesterday = new Date();
    console.log(yesterday);
    yesterday.setDate(yesterday.getDate() - 2);
    console.log(yesterday);
    console.log(body.fecha);
    //Validar que la fecha no sea anterior a la fecha actual
    if (body.fecha < yesterday.toISOString()) {
        return response.json({
            ok: false,
            mensaje: 'El día seleccionado no debe ser anterior a la fecha actual'
        });
    }
    //var fechaMaxima = new Date('2126-01-01').toISOString(); 
    /* console.log(new Date('2122-03-07').toISOString());
    console.log(body.fecha); */
    //Validar que la fecha no sea superior a 31/12/2125
    if (body.fecha > new Date('2122-03-07').toISOString()) {
        return response.json({
            ok: false,
            mensaje: 'El día seleccionado no debe superar el 07/03/2122'
        });
    }
    //Validación hora vacia
    if (body.hora == null) {
        return response.json({
            ok: false,
            mensaje: 'Debe seleccionar una hora'
        });
    }
    //Validación duracion vacia
    if (body.duracion == null) {
        return response.json({
            ok: false,
            mensaje: 'Debe seleccionar una duracion'
        });
    }
    //Validación duracion del acuerdo
    if (body.duracion < 1) {
        return response.json({
            ok: false,
            mensaje: 'La duración del acuerdo no puede ser menor a 1 hora'
        });
    }
    //Validación duracion del acuerdo
    if (body.duracion > 48) {
        return response.json({
            ok: false,
            mensaje: 'La duración del acuerdo no puede ser mayor a 48 horas'
        });
    }
    //Validación caracteres extraños en la descripción
    var caracteresDescripcion = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
    if (caracteresDescripcion.test(body.descripcion) == false) {
        return response.json({
            ok: false,
            mensaje: 'La descripción del acuerdo no permite tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
        });
    }
    if (Object.keys(body.opciones).length >= 2 && Object.keys(body.opciones).length <= 4) {
        //Validación caracteres extraños en titulo de la opcipón 1
        var caracteresTitulo1 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
        if (caracteresTitulo1.test(body.opciones[0]['titulo']) == false) {
            return response.json({
                ok: false,
                mensaje: 'La opcion 1 del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
            });
        }
        //Validación caracteres extraños en la descripción de la opcipón 1
        var caracteresDescripcion1 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
        if (caracteresDescripcion1.test(body.opciones[0]['descripcion']) == false) {
            return response.json({
                ok: false,
                mensaje: 'La descripcion 1 de las opciones del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
            });
        }
        //Validación caracteres extraños en titulo de la opcipón 2
        var caracteresTitulo2 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
        if (caracteresTitulo2.test(body.opciones[1]['titulo']) == false) {
            return response.json({
                ok: false,
                mensaje: 'La opcion 2 del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
            });
        }
        //Validación caracteres extraños en la descripción de la opcipón 2
        var caracteresDescripcion2 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
        if (caracteresDescripcion2.test(body.opciones[1]['descripcion']) == false) {
            return response.json({
                ok: false,
                mensaje: 'La descripcion 2 de las opciones del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
            });
        }
        if (Object.keys(body.opciones).length >= 3) {
            //Validación caracteres extraños en titulo de la opción 3
            var caracteresTitulo3 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
            if (caracteresTitulo3.test(body.opciones[2]['titulo']) == false) {
                return response.json({
                    ok: false,
                    mensaje: 'La opcion 3 del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
                });
            }
            //Validación caracteres extraños en la descripción de la opción 3
            var caracteresDescripcion3 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
            if (caracteresDescripcion3.test(body.opciones[2]['descripcion']) == false) {
                return response.json({
                    ok: false,
                    mensaje: 'La descripcion 3 de las opciones del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
                });
            }
        }
        if (Object.keys(body.opciones).length === 4) {
            //Validación caracteres extraños en titulo de la opción 4
            var caracteresTitulo4 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
            if (caracteresTitulo4.test(body.opciones[3]['titulo']) == false) {
                return response.json({
                    ok: false,
                    mensaje: 'La opcion 4 del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
                });
            }
            //Validación caracteres extraños en la descripción de la opción 4
            var caracteresDescripcion4 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
            if (caracteresDescripcion4.test(body.opciones[3]['descripcion']) == false) {
                return response.json({
                    ok: false,
                    mensaje: 'La descripcion 4 de las opciones del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
                });
            }
        }
    }
    else {
        return response.json({
            ok: false,
            mensaje: 'Cantidad de opciones no valida'
        });
    }
    acuerdosBDModel_1.Acuerdos.create(body).then((acuerdosDB) => __awaiter(void 0, void 0, void 0, function* () {
        //await acuerdosDB.populate('usuario').execPopulate();
        yield acuerdosDB.populate({ path: 'usuario', select: '-password' });
        yield acuerdosDB.populate({ path: 'comunidad' });
        response.json({
            ok: true,
            acuerdo: acuerdosDB
        });
    })).catch(err => {
        response.json(err);
    });
});
//Obtener acuerdo
rutasAcuerdos.get('/', [autenticacion_1.verificaToken], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(request.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const acuerdosPublicados = yield acuerdosBDModel_1.Acuerdos.find({ comunidad: request.usuario.comunidad, estado: { "$in": [1, 2, 3] } })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate({ path: 'usuario', select: '-password' })
        .populate({ path: 'comunidad' })
        .exec();
    response.json({
        ok: true,
        pagina,
        acuerdosPublicados
    });
}));
//subir imagenes para acuerdos
rutasAcuerdos.post('/upload', [autenticacion_1.verificaToken], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    if (!request.files) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Ningun archivo ha sido registrado'
        });
    }
    const archivo = request.files.imagenAcuerdo;
    if (!archivo) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Ningun archivo ha sido registrado de imagen'
        });
    }
    if (!archivo.mimetype.includes('image')) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Error, archivo ingresado no es una imagen'
        });
    }
    yield fileSystem.guardarImagenTemp(archivo, request.usuario._id);
    response.json({
        ok: true,
        archivo: archivo.mimetype
    });
}));
rutasAcuerdos.get('/imagenAcuerdo/:idUsuario/:imgAcuerdo', (request, response) => {
    const idUsuario = request.params.idUsuario;
    const imgAcuerdo = request.params.imgAcuerdo;
    const rutaFotoBD = fileSystem.getFotoUrl(idUsuario, imgAcuerdo);
    response.sendFile(rutaFotoBD);
});
//actualizar acuerdo
rutasAcuerdos.post('/actualizar', [autenticacion_1.verificaToken], (request, response) => {
    //Validaciones
    //Validaciónes en titulo
    var caracteresTitulo = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
    if (caracteresTitulo.test(request.body.titulo) == false) {
        return response.json({
            ok: false,
            mensaje: 'El título del acuerdo no permite tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
        });
    }
    //Validación fecha vacia
    if (request.body.fecha == null) {
        return response.json({
            ok: false,
            mensaje: 'Debe seleccionar un día'
        });
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 2);
    //Validar que la fecha no sea anterior a la fecha actual
    if (request.body.fecha < yesterday.toISOString()) {
        return response.json({
            ok: false,
            mensaje: 'El día seleccionado no debe ser anterior a la fecha actual'
        });
    }
    //var fechaMaxima = new Date('2126-01-01').toISOString(); 
    console.log(new Date('2122-03-07').toISOString());
    console.log(request.body.fecha);
    //Validar que la fecha no sea superior a 31/12/2125
    if (request.body.fecha > new Date('2122-03-07').toISOString()) {
        return response.json({
            ok: false,
            mensaje: 'El día seleccionado no debe superar el 07/03/2122'
        });
    }
    //Validación hora vacia
    if (request.body.hora == null) {
        return response.json({
            ok: false,
            mensaje: 'Debe seleccionar una hora'
        });
    }
    //Validación duracion vacia
    if (request.body.duracion == null) {
        return response.json({
            ok: false,
            mensaje: 'Debe seleccionar una duracion'
        });
    }
    //Validación duracion del acuerdo
    if (request.body.duracion < 1) {
        return response.json({
            ok: false,
            mensaje: 'La duración del acuerdo no puede ser menor a 1 hora'
        });
    }
    //Validación duracion del acuerdo
    if (request.body.duracion > 48) {
        return response.json({
            ok: false,
            mensaje: 'La duración del acuerdo no puede ser mayor a 48 horas'
        });
    }
    //Validación caracteres extraños en la descripción
    var caracteresDescripcion = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
    if (caracteresDescripcion.test(request.body.descripcion) == false) {
        return response.json({
            ok: false,
            mensaje: 'La descripción del acuerdo no permite tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
        });
    }
    if (Object.keys(request.body.opciones).length >= 2 && Object.keys(request.body.opciones).length <= 4) {
        //Validación caracteres extraños en titulo de la opcipón 1
        var caracteresTitulo1 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
        if (caracteresTitulo1.test(request.body.opciones[0]['titulo']) == false) {
            return response.json({
                ok: false,
                mensaje: 'La opcion 1 del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
            });
        }
        //Validación caracteres extraños en la descripción de la opcipón 1
        var caracteresDescripcion1 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
        if (caracteresDescripcion1.test(request.body.opciones[0]['descripcion']) == false) {
            return response.json({
                ok: false,
                mensaje: 'La descripcion 1 de las opciones del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
            });
        }
        //Validación caracteres extraños en titulo de la opcipón 2
        var caracteresTitulo2 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
        if (caracteresTitulo2.test(request.body.opciones[1]['titulo']) == false) {
            return response.json({
                ok: false,
                mensaje: 'La opcion 2 del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
            });
        }
        //Validación caracteres extraños en la descripción de la opcipón 2
        var caracteresDescripcion2 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
        if (caracteresDescripcion2.test(request.body.opciones[1]['descripcion']) == false) {
            return response.json({
                ok: false,
                mensaje: 'La descripcion 2 de las opciones del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
            });
        }
        if (Object.keys(request.body.opciones).length >= 3) {
            //Validación caracteres extraños en titulo de la opción 3
            var caracteresTitulo3 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
            if (caracteresTitulo3.test(request.body.opciones[2]['titulo']) == false) {
                return response.json({
                    ok: false,
                    mensaje: 'La opcion 3 del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
                });
            }
            //Validación caracteres extraños en la descripción de la opción 3
            var caracteresDescripcion3 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
            if (caracteresDescripcion3.test(request.body.opciones[2]['descripcion']) == false) {
                return response.json({
                    ok: false,
                    mensaje: 'La descripcion 3 de las opciones del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
                });
            }
        }
        if (Object.keys(request.body.opciones).length === 4) {
            //Validación caracteres extraños en titulo de la opción 4
            var caracteresTitulo4 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
            if (caracteresTitulo4.test(request.body.opciones[3]['titulo']) == false) {
                return response.json({
                    ok: false,
                    mensaje: 'La opcion 4 del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
                });
            }
            //Validación caracteres extraños en la descripción de la opción 4
            var caracteresDescripcion4 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
            if (caracteresDescripcion4.test(request.body.opciones[3]['descripcion']) == false) {
                return response.json({
                    ok: false,
                    mensaje: 'La descripcion 4 de las opciones del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
                });
            }
        }
    }
    else {
        return response.json({
            ok: false,
            mensaje: 'Cantidad de opciones no valida'
        });
    }
    const imagenes = fileSystem.imagenesTempHaciaAvisos(request.usuario._id);
    var dataAcuerdo = {};
    /*  const dataAcuerdo = {
        
         titulo: request.body.titulo,
         descripcion: request.body.descripcion,
         fecha: request.body.fecha,
         hora: request.body.hora,
         duracion: request.body.duracion,
         fechaLanzada: request.body.fechaLanzada,
         imagenAcuerdo: request.body.imagenAcuerdo || imagenes,
         opciones: request.body.opciones,
         votantes: request.body.votantes,
         estado: request.body.estado
     } */
    if (imagenes[0] != null) {
        dataAcuerdo =
            {
                titulo: request.body.titulo,
                descripcion: request.body.descripcion,
                fecha: request.body.fecha,
                hora: request.body.hora,
                duracion: request.body.duracion,
                fechaLanzada: request.body.fechaLanzada,
                imagenAcuerdo: imagenes,
                opciones: request.body.opciones,
                votantes: request.body.votantes,
                estado: request.body.estado
            };
    }
    else {
        dataAcuerdo = {
            titulo: request.body.titulo,
            descripcion: request.body.descripcion,
            fecha: request.body.fecha,
            hora: request.body.hora,
            duracion: request.body.duracion,
            fechaLanzada: request.body.fechaLanzada,
            opciones: request.body.opciones,
            votantes: request.body.votantes,
            estado: request.body.estado
        };
    }
    acuerdosBDModel_1.Acuerdos.findByIdAndUpdate(request.body._id, dataAcuerdo, { new: true }, (err, acuerdoDB) => {
        if (err)
            throw err;
        if (!acuerdoDB) {
            return response.json({
                ok: false,
                mensaje: 'No existe el acuerdo solicitado'
            });
        }
        response.json({
            ok: true,
            acuerdo: acuerdoDB
        });
    });
});
exports.default = rutasAcuerdos;
