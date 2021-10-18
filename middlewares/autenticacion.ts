import {Response, Request, NextFunction} from 'express';
import Token from '../clases/token';




export const verificaToken= (request: any, response: Response, next: NextFunction) => 
{
    const tokenUsuario = request.get('Utoken') || '';

    Token.checkToken(tokenUsuario).then((decoded: any) =>
        {
            request.usuario = decoded.usuario;
            next();
        }).catch( err => 
            {
                response.json({
                    ok: false,
                    mensaje: 'Token invalido'
                })

            })
}