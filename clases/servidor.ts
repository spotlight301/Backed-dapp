import express from 'express';


export default class Servidor
{
    public app: express.Application;
    public port: any = process.env.PORT || 3000;

    constructor()
    {
        this.app = express();
    }


    start(callback: any)
    {
        this.app.listen(this.port, callback)
    }
}