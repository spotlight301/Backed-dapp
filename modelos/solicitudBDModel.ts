import {Schema, Document, model} from 'mongoose';

const estructuraSolicitud = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Las solicitudes deben incluir un usuario']
    },
    comunidad:{
        type: Schema.Types.ObjectId,
        ref: 'Comunidad',
        required: [true, 'Las solicitudes deben incluir una comunidad']
    },
    mensaje:{
        type: String
    }
});


interface ISolicitud extends Document{
    usuario: string;
    comunidad: string;
    mensaje: string;
}


export const Solicitud = model<ISolicitud>('Solicitud', estructuraSolicitud);