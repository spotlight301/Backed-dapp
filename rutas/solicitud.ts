import { Router, Request, Response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Solicitud } from '../modelos/solicitudBDModel';

//crearemos el objeto con el cual realizaremos las peticiones
const rutasSolicitud = Router();

//crear una solicitud
rutasSolicitud.post('/crear', [verificaToken], (request: any, response: Response) =>
{

    const dataSolicitud = {
        usuario: request.usuario._id,
        comunidad: request.body._id,
        mensaje: request.body.mensaje
    }

    var existeSolicitud: any = {};

    var codigo= 0;

    existeSolicitud = Solicitud.find({comunidad: dataSolicitud.comunidad})
                                .exec();


    if(existeSolicitud == {} && codigo == 0)
    {
        Solicitud.create(dataSolicitud).then(solicitudBD =>
            {
                response.json({
                    ok: true,
                    solicitudBD
                });
    
            });

    }else{
        response.json({
            ok: false,
            codigo: 1
        });
    }

    
    
});




//exportamos el objeto para ocuparla en index
export default rutasSolicitud;