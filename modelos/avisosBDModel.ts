//definiremos la estructura de la tabla usuario que ocuparemos en BD
import {Schema, Document, model} from 'mongoose';

const estructuraAvisos = new Schema({

    fechaCreacion: {
        type: Date
    },
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    imagenAviso: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Los avisos deben ser realizados por un miembro']
    }

});

estructuraAvisos.pre<IAvisos>('save', function( next){
    this.fechaCreacion = new Date();
    next();
});


interface IAvisos extends Document{

    fechaCreacion: Date;
    titulo: string;
    descripcion: string;
    imagenAviso: string;
    usuario: string;

}

export const Avisos= model <IAvisos>('Avisos', estructuraAvisos);