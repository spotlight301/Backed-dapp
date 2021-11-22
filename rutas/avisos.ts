import { Router, Response } from "express";
import { verificaToken } from '../middlewares/autenticacion';
import { Avisos } from '../modelos/avisosBDModel';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../clases/file-system';
import { Comunidad } from '../modelos/comunidadBDModel';


const fileSystem = new FileSystem();
const rutasAvisos = Router();


//crear un nuevo aviso
rutasAvisos.post('/', [verificaToken], (request: any, response: Response) =>
{
    //la constante body almacenara el contenido que se envia desde la pagina al servidor
    //posteriormente sera esta informacion que enviaremos a traves de la funcion create para insertar en la BD
    const body= request.body;
    body.usuario = request.usuario._id;
    body.comunidad = request.usuario.comunidad;
    //body.Miembro.comunidad = 'test3';

    const imagenes = fileSystem.imagenesTempHaciaAvisos(request.usuario._id);
    body.imagenAviso = imagenes;
    //a través de create se nos inserta la informacion en la BD
    Avisos.create(body).then( async avisosBD =>{

        //avisosBD.populate('usuario').execPopulate();
        await avisosBD.populate({path:'usuario',select: '-password'})
        await avisosBD.populate({path: 'comunidad'})
        response.json({
            ok: true,
            aviso: avisosBD
            
        })


    }).catch( err => {
        response.json(err)
    })
    
});


//obtener avisos 
rutasAvisos.get('/',[verificaToken], async (request: any, response: Response) => {
    //a traves de la variable pagina y skip vamos iterando nuestros avisos de 10 en 10 desde atras hacia adelante
    let pagina = Number(request.query.pagina) || 1;
    let skip   = pagina -1; 
    skip = skip * 10;
    

    const avisosPublicados = await  Avisos.find({comunidad: request.usuario.comunidad})
                                          .sort({_id: -1})  //de esta manera le decimos que parta del ultimo registr
                                          .skip(skip)
                                          .limit(10)
                                          .populate({path:'usuario',select: '-password'})
                                          .populate({path:'comunidad'})
                                          .exec();
    response.json({
        ok: true,
        pagina,
        avisosPublicados
    });
})



//subir imagenes a BD
rutasAvisos.post('/subirImagen', [verificaToken], async (request: any, response: Response) => {
    //podemos acceder a la propiedad files gracias a fileUpload :p

    if(! request.files)
    {
        return response.status(400).json({
           ok: false,
           mensaje: 'Ningun archivo ha sido registrado' 
        })

    }

    const archivo: FileUpload = request.files.imagenAviso;
    //validacion para que el archivo no venga vacio
    if(! archivo)
    {
        return response.status(400).json({
            ok: false,
            mensaje: 'Ningun archivo ha sido registrado (imagen)' 
         });
    }

    //validacion para que solo se suban imagenes
    if(! archivo.mimetype.includes('image'))
    {
        return response.status(400).json({
            ok: false,
            mensaje: 'Error, archivo ingresado no es imagen' 
         });
        
    }

    await fileSystem.guardarImagenTemp(archivo, request.usuario._id);
    response.json({
        ok: true,
        archivo: archivo.mimetype
    })
});

//al definir de esta manera la ruta de nuestro archivo, estamos obligando al servicio
//a enviar las variables "idUsuario" y "imgAviso"
rutasAvisos.get('/imagenAviso/:idUsuario/:imgAviso', (request: any, response: Response) =>
{
    const idUsuario = request.params.idUsuario;
    const imgAviso = request.params.imgAviso;

    const rutaFotoBD = fileSystem.getFotoUrl(idUsuario, imgAviso );

    response.sendFile(rutaFotoBD);

});


//obtener avisos por Id de usuario
rutasAvisos.get('/usuario',[verificaToken], async (request: any, response: Response) => {
    //a traves de la variable pagina y skip vamos iterando nuestros avisos de 10 en 10 desde atras hacia adelante
    let pagina = Number(request.query.pagina) || 1;
    let skip   = pagina -1; 
    skip = skip * 10;
    

    const avisosPublicados = await  Avisos.find({comunidad: request.usuario.comunidad,
                                                usuario: request.usuario._id})
                                          .sort({_id: -1})  //de esta manera le decimos que parta del ultimo registr
                                          .skip(skip)
                                          .limit(10)
                                          .populate({path:'usuario',select: '-password'})
                                          .populate({path:'comunidad'})
                                          .exec();
    response.json({
        ok: true,
        pagina,
        avisosPublicados
    });


   
})


 //actualizarLAinformacion de un aviso publicado por un usuario
 rutasAvisos.post('/actualizar', [verificaToken], (request: any, response: Response) =>
 {
     const updatedAviso ={
         titulo: request.body.titulo,
         descripcion: request.body.descripcion,
         tipoAviso: request.body.tipoAviso
     }

     Avisos.findByIdAndUpdate(request.body._id, updatedAviso, {new: true}, (err, avisosBD) =>
     {
         if(err) throw err;

         if(!avisosBD)
         {
             return response.json({
                 ok: false,
                 mensaje: 'Aviso no encontrado'
             });
         }

         response.json({
            ok: true,
            usuario: request.usuario,
            avisosBD
       
        });


     });
     
 } )





export default rutasAvisos;