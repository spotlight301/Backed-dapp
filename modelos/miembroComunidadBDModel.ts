//definiremos la estructura de la tabla usuario que ocuparemos en BD
import {Schema, Document, model} from 'mongoose';


const estructuraMiembro = new Schema({

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Los avisos deben ser realizados por un miembro']
    },
    comunidad: 
    {
        type: Schema.Types.ObjectId,
        ref: 'Comunidad'
    }
});


interface IMiembro extends Document
{
    usuario: string;
    comunidad: string;
}

export const Miembro = model <IMiembro>('Miembro', estructuraMiembro);