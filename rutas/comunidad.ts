import { Router, Request, Response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Comunidad } from '../modelos/comunidadBDModel';
import { Usuario } from "../modelos/usuarioBDModel";


//crearemos el objeto con el cual realizaremos las peticiones

const rutasComunidad = Router();


//crear una comunidad
rutasComunidad.post('/crear', (request: any, response: Response) =>
{
    //llenamos el objeto que crearemos comunidad
    const dataComunidad = 
    { 
        nombreComunidad: request.body.nombreComunidad,
        descripcion: request.body.descripcion,
        coordenadas: request.body.coordenadas
    }

    const idUsuario = request.body.usuario;

    
    
    //creamos comunidad
    Comunidad.create(dataComunidad).then( comunidadBD =>
        {
            //buscamos al usuario por id para traer sus comunidades
            //y agregar la nueva comunidad
            Usuario.findOne({_id: idUsuario}, (err: any, usuarioBD: any) =>
            {
                if(err) throw err;
                if(!usuarioBD)
                {
                    return response.json({
                             ok: false,
                             mensaje: 'ID incorrecta'
                                });
                }

        
                var arrayComunidades = [];
                arrayComunidades = usuarioBD.comunidad;
                arrayComunidades.push(comunidadBD._id);

                const dataUsuario = 
                    {
                    _id: usuarioBD._id,
                    comunidad: arrayComunidades
                    }
                
                //ahora que tenemos listo la data el usuario actualizaremos la info
                Usuario.findByIdAndUpdate(idUsuario, dataUsuario, {new: true}, (err, usuarioBD) =>
                {
                    if(err) throw err;

                    if(!usuarioBD)
                    {
                        return request.json({
                            ok: false,
                            mensaje: 'Usuario no encontrado'
                            })
                    }

                    response.json({
                        ok: true,
                        IdComunidad: comunidadBD._id,
                        nombre: comunidadBD.nombreComunidad,
                        usuario: usuarioBD
                    });



                } ) //fin actualizar usuario
                
    
            }) //fin a findOne usuario
            

            

            


         //fin a crear comunidad   
        }).catch( err =>
            {
                response.json({
                    ok: false,
                    err
                });
            })
});

//Obtener comunidades por usuario
rutasComunidad.get('/', [verificaToken], (request: any, response: Response) =>
{

    const comunidades = Comunidad.find({comunidad: request.usuario.comunidad})
                                 .populate({path: 'comunidad'})
                                 .exec();
                                 
    response.json({
        comunidades,
        ok: true
    });

});


//crear una comunidad
rutasComunidad.post('/crearDefault',  (request: any, response: Response) =>
{
    const dataComunidad = 
    { 
        nombreComunidad: request.body.nombreComunidad,
        descripcion: request.body.descripcion,
        coordenadas: request.body.coordenadas
    }

    
    

    Comunidad.create(dataComunidad).then( comunidadBD =>
        {
            response.json({
                ok: true,
                IdComunidad: comunidadBD._id
            });            
        }).catch( err =>
            {
                response.json({
                    ok: false,
                    err
                });
            })
});



//exportamos el objeto para ocuparla en index
export default rutasComunidad;