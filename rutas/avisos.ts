import { Router, Response } from "express";
import { verificaToken } from '../middlewares/autenticacion';
import { Avisos } from '../modelos/avisosBDModel';
import { FileUpload } from '../interfaces/file-upload';



const rutasAvisos = Router();


//crear un nuevo aviso
rutasAvisos.post('/', [verificaToken], (request: any, response: Response) =>
{
    //la constante body almacenara el contenido que se envia desde la pagina al servidor
    //posteriormente sera esta informacion que enviaremos a traves de la funcion create para insertar en la BD
    const body= request.body;
    body.usuario = request.usuario._id;
    //a través de create se nos inserta la informacion en la BD
    Avisos.create(body).then( async avisosBD =>{

        //avisosBD.populate('usuario').execPopulate();
        await avisosBD.populate({path:'usuario',select: '-password'})
        response.json({
            ok: true,
            aviso: avisosBD
            
        })


    }).catch( err => {
        response.json(err)
    })
    
});


//obtener avisos 
rutasAvisos.get('/', async (request: any, response: Response) => {
    //a traves de la variable pagina y skip vamos iterando nuestros avisos de 10 en 10 desde atras hacia adelante
    let pagina = Number(request.query.pagina) || 1;
    let skip   = pagina -1; 
    skip = skip * 10;

    const avisosPublicados = await  Avisos.find()
                                          .sort({_id: -1})  //de esta manera le decimos que parta del ultimo registr
                                          .skip(skip)
                                          .limit(10)
                                          .populate({path:'usuario',select: '-password'})
                                          .exec();
    response.json({
        ok: true,
        pagina,
        avisosPublicados
    });
})



//subir imagenes a BD
rutasAvisos.post('/subirImagen', [verificaToken], (request: any, response: Response) => {
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

    response.json({
        ok: true,
        archivo: archivo.mimetype
    })
})








export default rutasAvisos;