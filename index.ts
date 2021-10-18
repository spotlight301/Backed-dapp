import Servidor from "./clases/servidor";
import rutasUsuario from "./rutas/usuario";
import mongoose from 'mongoose';
import express from "express";

const servidor = new Servidor();


servidor.app.use(express.urlencoded ({extended: true}));
servidor.app.use(express.json() );


//rutas de la aplicacion
servidor.app.use('/usuario', rutasUsuario);




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