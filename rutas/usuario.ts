import { Router, Request, Response } from "express";
import { Usuario } from '../modelos/usuarioBDModel';
import bcrypt from 'bcrypt';
import Token from '../clases/token';
import { verificaToken } from "../middlewares/autenticacion";
import { Comunidad } from '../modelos/comunidadBDModel';

//objeto que reconocera express para escribir en el URL direccione que usaremos
const rutasUsuario = Router();
//function para autentificarse
rutasUsuario.post('/login', (request: Request, response: Response) =>
{

    //Validaciones

    if(request.body.email == ""){

        return response.json({
            ok: false,
            mensaje: 'Correo requerido.'
        });
    }
  
    if(request.body.password == ""){

        return response.json({
            ok: false,
            mensaje: 'Contraseña requerida.'
        });
    }

    
    Usuario.findOne({email: request.body.email}, (err: any, usuarioBD: any) =>
    {
        if(err) throw err;
        if(!usuarioBD)
        {
            return response.json({
                ok: false,
                mensaje: 'Sus credenciales de acceso no son correctas'
            });
        }

        if(usuarioBD.checkPass(request.body.password))
        {
            const Usuariotoken = Token.getJwtToken({
                _id: usuarioBD._id,
                nombre:  usuarioBD.nombre,
                email: usuarioBD.email,
                imagenPerfil: usuarioBD.imagenPerfil,
                rol: usuarioBD.rol[0],
                comunidad: usuarioBD.comunidad[0]

            })
            response.json({
                ok: true,
                token: Usuariotoken
                
            }); 

        }else{
            response.json({
                ok: false,
                mensaje: 'Sus credenciales de acceso no son correctas'
            }); 
        }
    });

} );


//function para crear un usuario
rutasUsuario.post('/crear', (request: Request, response: Response) => 
{
    //Validaciones

    //Validación caracteres extraños en nombre
    var caracteres = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{3,50})+$/g;

    if(caracteres.test(request.body.nombre) == false){

        return response.json({
            ok: false,
            mensaje: 'El nombre de usuario no permite tener los caracteres ingresados. Con un mínimo de 3 caracteres y un máximo de 50.'
        });
    }
    console.log(request.body.fechaNacimiento);

    if(request.body.fechaNacimiento == null){

        return response.json({
            ok: false,
            mensaje: 'Debe seleccionar un día'
        });
    }

    const today = new Date();
  
    //Validar que la fecha no sea mayor a la fecha actual
    if(request.body.fechaNacimiento > today.toISOString()){

        return response.json({
            ok: false,
            mensaje: 'El día seleccionado no debe ser mayor a la fecha actual.'
        });
    }

    //Validación de correo
    var correo = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if(correo.test(request.body.email) == false){

        return response.json({
            ok: false,
            mensaje: 'Debe ingresar un correo valido.'
        });
    }

    if(request.body.email.length > 150){

        return response.json({
            ok: false,
            mensaje: 'El correo electrónico no puede tener más de 150 caracteres.'
        });
    }

    if(request.body.password.length < 6){

        return response.json({
            ok: false,
            mensaje: 'La contraseña no puede tener menos de 6 caracteres.'
        });
    }

    if(request.body.password.length > 100){

        return response.json({
            ok: false,
            mensaje: 'La contraseña no puede tener más de 100 caracteres.'
        });
    }
    
    //Validación de contraseñas
    /* if(this.repitaPassword != request.body.password){

      return this.alertasService.alerta('Las contraseñas no coinciden.'); 
    } */

    request.body.comunidad = '61ac3ce9c27143f6fe782cf0';
    //request.body.comunidad = '61cb35482aed3c07425bd8ce';
    request.body.rol = 2;

    const dataUsuario = {
        nombre      : request.body.nombre,
        fechaNacimiento: request.body.fechaNacimiento,
        email       : request.body.email,
        password    : bcrypt.hashSync(request.body.password, 10),
        imagenPerfil: request.body.imagenPerfil,
        rol         : request.body.rol,
        comunidad   : request.body.comunidad

    }

    Usuario.create(dataUsuario).then(usuarioBD =>
        {
            const Usuariotoken = Token.getJwtToken({
                _id: usuarioBD._id,
                nombre:  usuarioBD.nombre,
                email: usuarioBD.email,
                imagenPerfil: usuarioBD.imagenPerfil,
                rol: usuarioBD.rol,
                comunidad: usuarioBD.comunidad

            })
            response.json({
                ok: true,
                token: Usuariotoken
            }); 
            

        }).catch( err =>
            {
                response.json({
                    ok: false,
                    err

                });

            })

    

});


//actualizar datos del usuario
rutasUsuario.post('/actualizar', verificaToken,(request: any, response: Response) => 
{

    const dataUsuario = {
        nombre      : request.body.nombre || request.usuario.nombre,
        fechaNacimiento: request.body.fechaNacimiento || request.usuario.fechaNacimiento,
        email       : request.body.email || request.usuario.email,
        password    : request.body.password || request.usuario.password,
        imagenPerfil: request.body.imagenPerfil || request.usuario.imagenPerfil,
        

    }

    Usuario.findByIdAndUpdate(request.usuario._id, dataUsuario, {new: true}, (err, usuarioBD) =>
    {
        if(err) throw err;

        if(!usuarioBD)
        {
            return request.json({
                ok: false,
                mensaje: 'Usuario no encontrado'
            })
        }

        const Usuariotoken = Token.getJwtToken({
            _id: usuarioBD._id,
            nombre:  usuarioBD.nombre,
            email: usuarioBD.email,
            imagenPerfil: usuarioBD.imagenPerfil,
            rol: usuarioBD.rol

        })
        response.json({
            ok: true,
            token: Usuariotoken
        }); 




    });

});


rutasUsuario.get('/', [verificaToken], (request: any, response: Response) =>
{
    const usuario = request.usuario;
    
    response.json({
        ok: true,
        usuario
    })
});

rutasUsuario.get('/comunidad',[verificaToken],  async (request: any, response: Response) =>
{
    const comunidades = await Usuario.findById(request.usuario._id)
                                     .populate({path:'comunidad'})
                                     .select('-password')
                                     .exec();
    response.json({
        ok: true,
        comunidades
    });

});

//actualizar Token
rutasUsuario.post('/updateToken' , (request: any, response: Response) =>
{
    const data = {
        usuario: request.body.usuario,
        posicion: request.body.posicion
    }
    

    Usuario.findOne({_id: data.usuario}, (err:any , usuarioBD: any) =>
    {
        if(err) throw err;

        if(!usuarioBD)
        {
            return response.json({
                ok: false,
                mensaje: 'ID incorrecta'});
        }

        const usuarioToken = Token.getJwtToken({
            _id: usuarioBD._id,
            nombre: usuarioBD.nombre,
            email: usuarioBD.email,
            imagenPerfil: usuarioBD.imagenPerfil,
            rol: usuarioBD.rol[data.posicion],
            comunidad: usuarioBD.comunidad[data.posicion]

        })



        response.json({
            ok: true,
            token: usuarioToken
        });


    })
    

});

//funcion para remover una comunidad de la data de usuario
rutasUsuario.post('/abandonarComunidad', [verificaToken], (request: any, response: Response) => {

    const comunidadBorrar = {
        id: request.body._id
    }
    //encontramos al usuario para obtener sus comunidades y roles
    Usuario.findById(request.usuario._id, (err : any, usuarioBD : any) => {
        if (err)
            throw err;
        if (!usuarioBD) {
            return response.json({
                ok: false,
                mensaje: 'ID incorrecta'
            });
        }

        //pasamos las comunidades y los roles a dos arrays para trabajarlos mejor
        var arrayComunidades = [];
        var arrayRol = [];
        arrayComunidades = usuarioBD.comunidad;
        arrayRol = usuarioBD.rol;
        var usuarioToken: any;
        var auxToken = false;
        
        //removemos data de ambos Arrays
        let index = arrayComunidades.indexOf(comunidadBorrar.id);
        if (index != -1) {
            arrayComunidades.splice(index, 1);
            
        }
        arrayRol.splice(index, 1);
        const dataUsuario = {
            rol: arrayRol,
            comunidad: arrayComunidades
        };
        
        //actualizamos el usuario
Usuario.findByIdAndUpdate(usuarioBD._id, dataUsuario, { new: true }, (err, usuarioUpdate) => {
    if (err)
        throw err;
    if (!usuarioUpdate) {
        return request.json({
            ok: false,
            mensaje: 'Usuario no encontrado'
        });
    }
    if (request.usuario.comunidad == comunidadBorrar.id) {
        auxToken = true;
        usuarioToken = Token.getJwtToken({
            _id: usuarioBD._id,
            nombre: usuarioBD.nombre,
            email: usuarioBD.email,
            imagenPerfil: usuarioBD.imagenPerfil,
            rol: usuarioBD.rol[0],
            comunidad: usuarioBD.comunidad[0]
        });
    }
    if (auxToken) {
        response.json({
            ok: true,
            token: usuarioToken
        });
    }
    else {
        response.json({
            ok: true
        });
    }
});
    });
});


rutasUsuario.get('/arrayComunidad',[verificaToken],  async (request: any, response: Response) =>
{
    const comunidades = await Usuario.findById(request.usuario._id)                               
                                     .select('comunidad')
                                     .exec();
    response.json({
        ok: true,
        comunidades
    });

});


rutasUsuario.get('/miembrosComunidad',[verificaToken], async  (request: any,  response: Response) =>
{
    const miembros =  await Usuario.find({comunidad: request.usuario.comunidad},{nombre: 1, comunidad:1, rol:1})                               
                                   .exec();

    const comBD = await Comunidad.findOne({_id: request.usuario.comunidad})
                                 .exec();
    response.json({
        ok: true,
        miembros,
        comBD
    });
});

//Funcion que retorna un array con las Id de los miembros de una comunidad
rutasUsuario.get('/arrayMiembrosComunidad',[verificaToken], async  (request: any,  response: Response) =>
{
    const miembros =  await Usuario.find({comunidad: request.usuario.comunidad},{_id:1})                               
                                   .exec();
    
    response.json({
        ok: true,
        miembros
    });
});



rutasUsuario.post('/actualizarRol', (request: any,  response: Response) =>
{
    const dataUsuario = {
        idUsuario: request.body.idUsuario,
        idComunidad: request.body.idComunidad,
        rol: request.body.rol
    }

    Usuario.findOne({_id: dataUsuario.idUsuario}, (err:any, usuarioBD:any) =>
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
        arrayComunidades = usuarioBD.comunidad;
        arrayRol = usuarioBD.rol;
        let index = arrayComunidades.indexOf(dataUsuario.idComunidad);
        arrayRol[index] = dataUsuario.rol;

        const updateUser ={
            _id: usuarioBD._id,
            rol: arrayRol
        }
        Usuario.findByIdAndUpdate(dataUsuario.idUsuario, updateUser, {new:true}, (err, updatedBD) =>
        {
            if(err) throw err;

            if(!updatedBD)
            {
                return request.json({
                ok: false,
                mensaje: 'Usuario no encontrado'
                })
            }

            response.json({
                ok:true,
                })
        })//fin a findByIdAndUpdate

    }); //fin a findOne
    
}); //fin actualizar usuario

//Funcion que consulta a la base de datos el rol del usuario segun la comunidad
//que se encuentre en el Token
rutasUsuario.get('/obtenerRol',[verificaToken],  async (request: any, response: Response) =>
{
    Usuario.findById(request.usuario._id, {rol:1, comunidad: 1}, (err:any, usuarioBD:any) =>
    {
        var arrayComunidades = [];
        var arrayRol = [];
        var currentRol;
        arrayComunidades = usuarioBD.comunidad;
        arrayRol = usuarioBD.rol;
        let index = arrayComunidades.indexOf(request.usuario.comunidad);
        currentRol = arrayRol[index];
        response.json({
            currentRol
        });
    }) //fin a findById
                                 
});


//Funcion que nos muestra los datos personales del usuario
rutasUsuario.get('/mostrarDatos',[verificaToken],  async (request: any, response: Response) =>
{
    Usuario.findById(request.usuario._id, {nombre:1, fechaNacimiento:1, email:1, imagenPerfil:1}, (err:any, usuarioBD:any) =>
    {
        
        response.json({
            usuarioBD
        });
    }) //fin a findById
                                 
});

//Funcion que nos devuelve el array de comunidades y rol para validar la creacion del aviso
//en distintas partes de la app
rutasUsuario.get('/validarCrearAviso',[verificaToken],  async (request: any, response: Response) =>
{
    Usuario.findById(request.usuario._id, {comunidad:1, rol:1}, (err:any, usuarioBD:any) =>
    {
        
        response.json({
            usuarioBD
        });
    }) //fin a findById
                                 
});








export default rutasUsuario;