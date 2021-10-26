import Servidor from "./clases/servidor";
import mongoose from 'mongoose';
import express from "express";
import fileUpload from 'express-fileupload';
import cors from 'cors';
import rutasUsuario from "./rutas/usuario";
import rutasAvisos from "./rutas/avisos";

const servidor = new Servidor();


servidor.app.use(express.urlencoded ({extended: true}));
servidor.app.use(express.json() );

//configuracion para obtener los archivos que subimos 
servidor.app.use(fileUpload(
    {
        // useTempFiles : true,
        //tempFileDir : '/tmp/'
    }
));

//Configuración de CORS para que el servidor no bloquee peticiones hTTp de origin !=
servidor.app.use(cors({origin: true, credentials: true}));

//rutas de la aplicacion
servidor.app.use('/usuario', rutasUsuario);
servidor.app.use('/avisos', rutasAvisos);




//conecion a base de dato
mongoose.connect('mongodb://localhost:27017/veciRed',
                (err) => 
                {
                    if(err) throw err;
                    console.log("Conectado exitosamente a BD1");
                })


// main().catch(err => console.log(err));
// async function main() {
//     await mongoose.connect('mongodb://localhost:27017/veciRed').then( () =>
//      {console.log("Conectado exitosamente a BD")})
//   }

//levantamos el servidor
servidor.start(() => 
{
    console.log(`Servidor operativo en puerto ${servidor.port} `);

});