import { Response, Router } from "express";
import { verificaToken } from '../middlewares/autenticacion';
import { Acuerdos } from "../modelos/acuerdosBDModel";
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from "../clases/file-system";


const rutasAcuerdos = Router();
const fileSystem = new FileSystem();

//Crear acuerdo
rutasAcuerdos.post('/', [verificaToken], (request: any, response: Response) => {

    const body = request.body;
    body.usuario = request.usuario._id;
    body.comunidad = request.usuario.comunidad;
    body.estado = 1;

    const imagenes = fileSystem.imagenesTempHaciaAvisos(body.usuario);
    body.imagenAcuerdo = imagenes;

    //Validaciones

    //Validaciónes en titulo
    var caracteresTitulo = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;

    if(caracteresTitulo.test(body.titulo) == false){

        return response.json({
            ok: false,
            mensaje: 'El título del acuerdo no permite tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
             });
    }

    //Validación fecha vacia
    if(body.fecha == null){

        return response.json({
            ok: false,
            mensaje: 'Debe seleccionar un día'
        });
    }

    /* El método getTimezoneOffset() devuelve la diferencia, 
    en minutos, entre una fecha evaluada en la zona horaria UTC y 
    la misma fecha evaluada en la zona horaria local. 
    Luego se multiplican los minutos por 60000 obteniedo la diferencia horaria en milisegundos */
    var diferenciaZonaHorariaLocal = (new Date()).getTimezoneOffset() * 60000;
    var today = (new Date(Date.now() - diferenciaZonaHorariaLocal)).toISOString().slice(0, -14);
    
    //Validar que la fecha no sea anterior a la fecha actual
    if(body.fecha < today){
        return response.json({
            ok: false,
            mensaje: 'El día seleccionado no debe ser anterior a la fecha actual'
        });
    }

    //Validar que la fecha no sea superior a 31/12/2125
    if(body.fecha > new Date('2122-03-07').toISOString()){

        return response.json({
            ok: false,
            mensaje: 'El día seleccionado no debe superar el 07/03/2122'
        });
    }
  
    //Validación hora vacia
    if(body.hora == null){

        return response.json({
            ok: false,
            mensaje: 'Debe seleccionar una hora'
        });
    }
  
    //Validación duracion vacia
    if(body.duracion == null){

        return response.json({
            ok: false,
            mensaje: 'Debe seleccionar una duracion'
        });
    }
  
    //Validación duracion del acuerdo
    if(body.duracion < 1){

        return response.json({
            ok: false,
            mensaje: 'La duración del acuerdo no puede ser menor a 1 hora'
        });
    }
  
    //Validación duracion del acuerdo
    if(body.duracion > 48){

        return response.json({
            ok: false,
            mensaje: 'La duración del acuerdo no puede ser mayor a 48 horas'
        });
    }
  
    //Validación caracteres extraños en la descripción
    var caracteresDescripcion = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
  
    if(caracteresDescripcion.test(body.descripcion) == false){

        return response.json({
            ok: false,
            mensaje: 'La descripción del acuerdo no permite tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
        });  
    }

    if(Object.keys(body.opciones).length >= 2 && Object.keys(body.opciones).length <= 4){
        //Validación caracteres extraños en titulo de la opcipón 1
        var caracteresTitulo1 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
    
        if(caracteresTitulo1.test(body.opciones[0]['titulo']) == false){
    
            return response.json({
                ok: false,
                mensaje: 'La opcion 1 del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
            });
        }
    
        //Validación caracteres extraños en la descripción de la opcipón 1
        var caracteresDescripcion1 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
    
        if(caracteresDescripcion1.test(body.opciones[0]['descripcion']) == false){
    
            return response.json({
                ok: false,
                mensaje: 'La descripcion 1 de las opciones del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
            });
        }
    
        //Validación caracteres extraños en titulo de la opcipón 2
        var caracteresTitulo2 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
    
        if(caracteresTitulo2.test(body.opciones[1]['titulo']) == false){
    
            return response.json({
                ok: false,
                mensaje: 'La opcion 2 del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
            });
        }
    
        //Validación caracteres extraños en la descripción de la opcipón 2
        var caracteresDescripcion2 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
    
        if(caracteresDescripcion2.test(body.opciones[1]['descripcion']) == false){
    
            return response.json({
                ok: false,
                mensaje: 'La descripcion 2 de las opciones del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
            });
        }
    
        if(Object.keys(body.opciones).length >= 3){
          //Validación caracteres extraños en titulo de la opción 3
          var caracteresTitulo3 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
    
          if(caracteresTitulo3.test(body.opciones[2]['titulo']) == false){
    
            return response.json({
                ok: false,
                mensaje: 'La opcion 3 del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
            });
          }
    
          //Validación caracteres extraños en la descripción de la opción 3
          var caracteresDescripcion3 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
    
          if(caracteresDescripcion3.test(body.opciones[2]['descripcion']) == false){
    
            return response.json({
                ok: false,
                mensaje: 'La descripcion 3 de las opciones del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
            });
          }
    
        }
    
        if(Object.keys(body.opciones).length === 4){
          //Validación caracteres extraños en titulo de la opción 4
          var caracteresTitulo4 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
    
          if(caracteresTitulo4.test(body.opciones[3]['titulo']) == false){
    
            return response.json({
                ok: false,
                mensaje: 'La opcion 4 del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
            });
          }
    
          //Validación caracteres extraños en la descripción de la opción 4
          var caracteresDescripcion4 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
    
          if(caracteresDescripcion4.test(body.opciones[3]['descripcion']) == false){
    
            return response.json({
                ok: false,
                mensaje: 'La descripcion 4 de las opciones del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
            });
          }
        }
    }else{

        return response.json({
            ok: false,
            mensaje: 'Cantidad de opciones no valida'
        });
    }

    Acuerdos.create(body).then(async acuerdosDB => {

        //await acuerdosDB.populate('usuario').execPopulate();
        await acuerdosDB.populate({path:'usuario',select: '-password'})
        await acuerdosDB.populate({path: 'comunidad'})
        response.json({
            ok: true,
            acuerdo: acuerdosDB
            
        })


    }).catch( err => {
        response.json(err)
    })
});


//Obtener acuerdo
rutasAcuerdos.get('/', [verificaToken], async (request: any, response: Response) => {

    let pagina = Number(request.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;


    const acuerdosPublicados = await Acuerdos.find({comunidad: request.usuario.comunidad, estado: { "$in": [1, 2, 3] }})
                                             .sort({_id:-1})
                                             .skip(skip)
                                             .limit(10)
                                             .populate({path:'usuario',select: '-password'})
                                             .populate({path:'comunidad'})
                                             .exec();

    response.json({
        ok: true,
        pagina,
        acuerdosPublicados
    })


});

//subir imagenes para acuerdos
rutasAcuerdos.post('/upload', [verificaToken], async (request: any, response: Response) => {

    if(!request.files){
        return response.status(400).json({
            ok: false,
            mensaje: 'Ningun archivo ha sido registrado'
        });
    }

    const archivo: FileUpload = request.files.imagenAcuerdo;

    if(!archivo){
        return response.status(400).json({
            ok: false,
            mensaje: 'Ningun archivo ha sido registrado de imagen'
        });
    }

    if(!archivo.mimetype.includes('image')){
        return response.status(400).json({
            ok: false,
            mensaje: 'Error, archivo ingresado no es una imagen'
        });
    }

    await fileSystem.guardarImagenTemp(archivo, request.usuario._id);

    response.json({
        ok: true,
        archivo: archivo.mimetype
    });

    
});

rutasAcuerdos.get('/imagenAcuerdo/:idUsuario/:imgAcuerdo', (request: any, response: Response) =>
{
    const idUsuario = request.params.idUsuario;
    const imgAcuerdo = request.params.imgAcuerdo;

    const rutaFotoBD = fileSystem.getFotoUrl(idUsuario, imgAcuerdo);

    response.sendFile(rutaFotoBD);

});

//actualizar acuerdo
rutasAcuerdos.post('/actualizar', [verificaToken],(request: any, response: Response) => {
    //Validaciones

    //Validaciónes en titulo
    var caracteresTitulo = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;

    if(caracteresTitulo.test(request.body.titulo) == false){

        return response.json({
            ok: false,
            mensaje: 'El título del acuerdo no permite tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
        });
    }

    //Validación fecha vacia
    if(request.body.fecha == null){

        return response.json({
            ok: false,
            mensaje: 'Debe seleccionar un día'
        });
    }
      
    /* El método getTimezoneOffset() devuelve la diferencia, 
    en minutos, entre una fecha evaluada en la zona horaria UTC y 
    la misma fecha evaluada en la zona horaria local. 
    Luego se multiplican los minutos por 60000 obteniedo la diferencia horaria en milisegundos */
    var diferenciaZonaHorariaLocal = (new Date()).getTimezoneOffset() * 60000;
    var today = (new Date(Date.now() - diferenciaZonaHorariaLocal)).toISOString().slice(0, -14);
    
    //Validar que la fecha no sea anterior a la fecha actual
    if(request.body.fecha < today){
        return response.json({
            ok: false,
            mensaje: 'El día seleccionado no debe ser anterior a la fecha actual'
        });
    }

    //Validar que la fecha no sea superior a 07/03/2122
    if(request.body.fecha > new Date('2122-03-07').toISOString()){

        return response.json({
            ok: false,
            mensaje: 'El día seleccionado no debe superar el 07/03/2122'
        });
    }
  
    //Validación hora vacia
    if(request.body.hora == null){

        return response.json({
            ok: false,
            mensaje: 'Debe seleccionar una hora'
        });
    }
  
    //Validación duracion vacia
    if(request.body.duracion == null){

        return response.json({
            ok: false,
            mensaje: 'Debe seleccionar una duracion'
        });
    }
  
    //Validación duracion del acuerdo
    if(request.body.duracion < 1){

        return response.json({
            ok: false,
            mensaje: 'La duración del acuerdo no puede ser menor a 1 hora'
        });
    }
  
    //Validación duracion del acuerdo
    if(request.body.duracion > 48){

        return response.json({
            ok: false,
            mensaje: 'La duración del acuerdo no puede ser mayor a 48 horas'
        });
    }
  
    //Validación caracteres extraños en la descripción
    var caracteresDescripcion = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
  
    if(caracteresDescripcion.test(request.body.descripcion) == false){

        return response.json({
            ok: false,
            mensaje: 'La descripción del acuerdo no permite tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
        });  
    }

    if(Object.keys(request.body.opciones).length >= 2 && Object.keys(request.body.opciones).length <= 4){
        //Validación caracteres extraños en titulo de la opcipón 1
        var caracteresTitulo1 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
    
        if(caracteresTitulo1.test(request.body.opciones[0]['titulo']) == false){
    
            return response.json({
                ok: false,
                mensaje: 'La opcion 1 del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
            });
        }
    
        //Validación caracteres extraños en la descripción de la opcipón 1
        var caracteresDescripcion1 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
    
        if(caracteresDescripcion1.test(request.body.opciones[0]['descripcion']) == false){
    
            return response.json({
                ok: false,
                mensaje: 'La descripcion 1 de las opciones del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
            });
        }
    
        //Validación caracteres extraños en titulo de la opcipón 2
        var caracteresTitulo2 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
    
        if(caracteresTitulo2.test(request.body.opciones[1]['titulo']) == false){
    
            return response.json({
                ok: false,
                mensaje: 'La opcion 2 del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
            });
        }
    
        //Validación caracteres extraños en la descripción de la opcipón 2
        var caracteresDescripcion2 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
    
        if(caracteresDescripcion2.test(request.body.opciones[1]['descripcion']) == false){
    
            return response.json({
                ok: false,
                mensaje: 'La descripcion 2 de las opciones del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
            });
        }
    
        if(Object.keys(request.body.opciones).length >= 3){
          //Validación caracteres extraños en titulo de la opción 3
          var caracteresTitulo3 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
    
          if(caracteresTitulo3.test(request.body.opciones[2]['titulo']) == false){
    
            return response.json({
                ok: false,
                mensaje: 'La opcion 3 del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
            });
          }
    
          //Validación caracteres extraños en la descripción de la opción 3
          var caracteresDescripcion3 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
    
          if(caracteresDescripcion3.test(request.body.opciones[2]['descripcion']) == false){
    
            return response.json({
                ok: false,
                mensaje: 'La descripcion 3 de las opciones del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
            });
          }
    
        }
    
        if(Object.keys(request.body.opciones).length === 4){
          //Validación caracteres extraños en titulo de la opción 4
          var caracteresTitulo4 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,30})+$/g;
    
          if(caracteresTitulo4.test(request.body.opciones[3]['titulo']) == false){
    
            return response.json({
                ok: false,
                mensaje: 'La opcion 4 del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 30.'
            });
          }
    
          //Validación caracteres extraños en la descripción de la opción 4
          var caracteresDescripcion4 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!¿?\-.,()=/@ ]{3,250})+$/g;
    
          if(caracteresDescripcion4.test(request.body.opciones[3]['descripcion']) == false){
    
            return response.json({
                ok: false,
                mensaje: 'La descripcion 4 de las opciones del acuerdo no permiten tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 250.'
            });
          }
        }
    }else{

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

    if(imagenes[0] != null)
    {
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
        }
    }
    else{
        dataAcuerdo ={

            titulo: request.body.titulo,
            descripcion: request.body.descripcion,
            fecha: request.body.fecha,
            hora: request.body.hora,
            duracion: request.body.duracion,
            fechaLanzada: request.body.fechaLanzada,
            opciones: request.body.opciones,
            votantes: request.body.votantes,
            estado: request.body.estado
            
   
        }

    }

    Acuerdos.findByIdAndUpdate(request.body._id, dataAcuerdo, {new: true}, (err, acuerdoDB) =>{

        if(err) throw err;

        if(!acuerdoDB){
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

export default rutasAcuerdos;