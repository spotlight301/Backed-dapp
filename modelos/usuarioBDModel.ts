import  bcrypt  from 'bcrypt';
//definiremos la estructura de la tabla usuario que ocuparemos en BD
import {Schema, model, Document} from 'mongoose';


const estructuraUsuario= new Schema({

    nombre:
    {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    fechaNacimiento:
    {
        type: Date,
        required: [true, 'la fecha de nacimiento es obligatoria']
    },
    email:
    {
        type: String,
        unique: true,
        required: [true, 'El correo electronico es obligatorio']
    },
    password:
    {
        type: String,
        required: [true, 'La clave es obligatoria']
    },
    imagenPerfil:
    {
        type: String,
        default: 'av-3.png'
    },
    rol:
    [{
        type: Number,
        default: 1
    }],
    comunidad:[{
        type: Schema.Types.ObjectId,
        ref: 'Comunidad'
    }]


});

estructuraUsuario.method('checkPass', function(password: string =''):boolean{
    if(bcrypt.compareSync(password, this.password))
    {
        return true;
    }else
    {
        return false;
    }
})

interface IUsuario extends Document {
    nombre: string;
    fechaNacimiento: Date;
    email: string;
    password: string;
    imagenPerfil: string;
    rol: number[];
    comunidad: string[];

    checkPass(password: string): boolean;

}


export const Usuario = model<IUsuario>('Usuario', estructuraUsuario);