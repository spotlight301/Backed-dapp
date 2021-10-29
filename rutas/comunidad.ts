import { Router, Request, Response } from "express";
import { Comunidad } from '../modelos/comunidadBDModel';


//crearemos el objeto con el cual realizaremos las peticiones

const rutasComunidad = Router();


//crear una comunidad
rutasComunidad.post('/crear', (request: Request, response: Response) =>
{
    const dataComunidad = { nombreComunidad: request.body.nombreComunidad }


    Comunidad.create(dataComunidad).then( comunidadBD =>
        {
            response.json({
                ok: true,
                nombreComunidad: comunidadBD

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