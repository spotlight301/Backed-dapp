//definiremos la estructura de la tabla usuario que ocuparemos en BD
import {Schema, Document, model} from 'mongoose';

const estructuraComunidad = new Schema({
    nombreComunidad:
    {
        type: String,
        required: [true, 'El nombre de la comunidad es obligatorio'],
        default: 'Default Comunity '
    }
});

interface IComunidad extends Document {
    nombreComunidad: string;
}

export const Comunidad = model<IComunidad>('Comunidad', estructuraComunidad);