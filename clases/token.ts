import jwt from 'jsonwebtoken';



export default class Token
{
    private static seed: string = 'private-seed-veciRed@@$$';
    private static caducidad: string = '99d';

    constructor (){}

    static getJwtToken(payload: any): string
    {
        return jwt.sign({
            usuario: payload
        }, this.seed, {expiresIn: this.caducidad});
    }


    static checkToken(userToken: string)
    {
        return new Promise((resolve, reject) => {

            jwt.verify(userToken, this.seed, (err, decoded) =>
            {
            if(err)
            {
                reject();
            }else
            {
                resolve(decoded);
            }
            })

        })
        
    }
}