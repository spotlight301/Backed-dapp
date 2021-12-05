import { Router, Request, Response } from "express";
import { Usuario } from '../modelos/usuarioBDModel';
import bcrypt from 'bcrypt';
import Token from '../clases/token';
import { verificaToken } from "../middlewares/autenticacion";

//objeto que reconocera express para escribir en el URL direccione que usaremos
const rutasUsuario = Router();
//function para autentificarse
rutasUsuario.post('/login', (request: Request, response: Response) =>
{
    
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
    
    request.body.comunidad = '61ac3ce9c27143f6fe782cf0';

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
    // response.json({
    //     ok: true,
    //     usuario: request.usuario
    // })
    

    

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

} )

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
rutasUsuario.post('/abandonarComunidad' , (request: any, response: Response) =>
{
    response.json({
        ok: true,
    });


});



export default rutasUsuario;