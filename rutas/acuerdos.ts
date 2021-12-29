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