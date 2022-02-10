import { Router, Request, Response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Comunidad } from '../modelos/comunidadBDModel';
import { Usuario } from "../modelos/usuarioBDModel";


//crearemos el objeto con el cual realizaremos las peticiones

const rutasComunidad = Router();


//crear una comunidad
rutasComunidad.post('/crear', (request: any, response: Response) =>
{
     //INICIO VALIDACIONES BACKEND
     var caracteres = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!?¿@-_.,/()= ]{1,50})+$/g;

     if(caracteres.test(request.body.nombreComunidad) == false)
     {
         return response.json({
             ok: false,
             mensaje: 'Caracteres invalidos en título'
              });
     }
 
     var caracteres2 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!?¿@-_.,/()= ]{1,250})+$/g;
     if(caracteres2.test(request.body.descripcion) == false)
     {
         return response.json({
             ok: false,
             mensaje: 'Caracteres invalidos en descripción'
              });
     }
     if(request.body.nombreComunidad.length > 30 || request.body.nombreComunidad.length <= 2)
     {
         return response.json({
             ok: false,
             mensaje: 'Error en título'
              });
     }
 
     if(request.body.descripcion.length > 250 || request.body.descripcion.length <= 2)
     {
         return response.json({
             ok: false,
             mensaje: 'Error en descripción'
              });
     }
 
     //FIN VALIDACIONES BACKEND
    //llenamos el objeto que crearemos comunidad
    const dataComunidad = 
    { 
        nombreComunidad: request.body.nombreComunidad,
        descripcion: request.body.descripcion,
        coordenadas: request.body.coordenadas,
        region: request.body.region,
        comuna: request.body.comuna
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

                //inicializamos array en 0 para pasarle los valores y actualizarlos
                var arrayComunidades = [];
                var arrayRol = [];
                var newRol = 1;
                arrayComunidades = usuarioBD.comunidad;
                arrayRol = usuarioBD.rol;
                arrayComunidades.push(comunidadBD._id);
                arrayRol.push(newRol);


                const dataUsuario = 
                    {
                    _id: usuarioBD._id,
                    rol: arrayRol,
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
    request.body.region = 'Bío-Bío';
    request.body.comuna = 'Concepción'
    const dataComunidad = 
    { 
        nombreComunidad: request.body.nombreComunidad,
        descripcion: request.body.descripcion,
        coordenadas: request.body.coordenadas,
        region: request.body.region,
        comuna: request.body.comuna

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


rutasComunidad.post('/actualizar', (request: any, response: Response) =>
{
     //INICIO VALIDACIONES BACKEND
     var caracteres = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!?¿@-_.,/()= ]{1,250})+$/g;

     if(caracteres.test(request.body.nombreComunidad) == false)
     {
         return response.json({
             ok: false,
             mensaje: 'Caracteres invalidos en título'
              });
     }
 
     var caracteres2 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!?¿@-_.,/()= ]{1,250})+$/g;
     if(caracteres2.test(request.body.descripcion) == false)
     {
         return response.json({
             ok: false,
             mensaje: 'Caracteres invalidos en descripción'
              });
     }
     if(request.body.nombreComunidad.length > 30 || request.body.nombreComunidad.length <= 2)
     {
         return response.json({
             ok: false,
             mensaje: 'Error en título'
              });
     }
 
     if(request.body.descripcion.length > 250 || request.body.descripcion.length <= 2)
     {
         return response.json({
             ok: false,
             mensaje: 'Error en descripción'
              });
     }
 
     //FIN VALIDACIONES BACKEND
    const dataComunidad = {
        nombreComunidad: request.body.nombreComunidad,
        descripcion: request.body.descripcion,
        coordenadas: request.body.coordenadas,
        region: request.body.region,
        comuna: request.body.comuna 
    }

    Comunidad.findByIdAndUpdate(request.body._id, dataComunidad, {new: true}, (err, comunidadBD) =>
    {
        if(err) throw err;

        if(!comunidadBD)
        {
            return response.json({
                ok: false,
                mensaje: 'Comunidad no encontrada'
            });
        }

        response.json({
            ok: true,
            comunidadBD 
        });

    });

});


//filtrar comunidades para que un usuario pueda unirse
rutasComunidad.post('/buscar',  async (request: any,  response: Response) =>
{   
    const dataComunidad = {
        nombreComunidad: request.body.nombreComunidad,
        region: request.body.region,
        comuna: request.body.comuna,
      
    }

    if(dataComunidad.nombreComunidad != '')
    {
        //INICIO VALIDACIONES BACKEND
        var caracteres = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!?¿@-_.,/()= ]{1,250})+$/g;

        if(caracteres.test(request.body.nombreComunidad) == false)
        {
            return response.json({
                ok: false,
                mensaje: 'Caracteres invalidos en título'
             });
        }

        if(request.body.nombreComunidad.length > 30 )
     {
         return response.json({
             ok: false,
             mensaje: 'Error en título'
              });
     }

    //FIN VALIDACIONES BACKEND

    }

    var comunidades:any = {};

    //si solo viene el nombre
    if(dataComunidad.nombreComunidad != '' && dataComunidad.comuna == '' && dataComunidad.region == '' )
    {
        
        const regex = new RegExp(dataComunidad.nombreComunidad, 'i'); //case sensitive
        comunidades = await Comunidad.find({nombreComunidad: {$regex: regex}})
                                     .exec();
    }
    //si solo viene region
    if (dataComunidad.comuna == '' && dataComunidad.nombreComunidad == '' && dataComunidad.region != '')
    {
        comunidades = await Comunidad.find({region: dataComunidad.region})
                                     .exec();
    }


    //si solo viene region y comuna
    if(dataComunidad.comuna != '' && dataComunidad.region != '' && dataComunidad.nombreComunidad == '')
    {
        comunidades = await Comunidad.find({region: dataComunidad.region,
                                            comuna: dataComunidad.comuna})                           
                                     .exec();
    }

    //si viene nombre, region y comuna
    if(dataComunidad.comuna != '' && dataComunidad.region != '' && dataComunidad.nombreComunidad != '')
    {
        const regex = new RegExp(dataComunidad.nombreComunidad, 'i'); 
        comunidades = await Comunidad.find({ nombreComunidad: {$regex: regex}
                                            ,region: dataComunidad.region,
                                            comuna: dataComunidad.comuna})                           
                                     .exec();
    }

    //si solo viene nombre y region
    if( dataComunidad.region != '' && dataComunidad.nombreComunidad != '' && dataComunidad.comuna == '' )
    {
        const regex = new RegExp(dataComunidad.nombreComunidad, 'i'); 
        comunidades = await Comunidad.find({ nombreComunidad: {$regex: regex}
                                            ,region: dataComunidad.region})                           
                                     .exec();
    }
    
    

    // comunidades = await Comunidad.find({region:reg})
    //                              .exec();

    response.json({
        ok: true,
        comunidades  
    });




     
                                 
   

});

rutasComunidad.get('/nombreComunidad' , [verificaToken], async (request:any, response: Response) =>
{
    // await Comunidad.findOne({_id: request.usuario.comunidad},  (err:any, comBD:any) =>
    // {
    //     if(err) throw err;

    //     if(!comBD)
    //     {
    //         return response.json({
    //             ok: false,
    //             mensaje: 'Comunidad no encontrada'
    //         });
    //     }
    //      response.json({
    //         comBD
    //     })
    // })

    const comBD = await Comunidad.findOne({_id: request.usuario.comunidad})
                           .exec();

    response.json({
        ok: true,
        comBD
          });

})



//exportamos el objeto para ocuparla en index
export default rutasComunidad;