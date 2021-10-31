//definiremos la estructura de la tabla usuario que ocuparemos en BD
import {Schema, Document, model} from 'mongoose';

const estructuraAvisos = new Schema({

    fechaCreacion: {
        type: String
    },
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    imagenAviso: [{
        type: String,
    }],
   
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Los avisos deben ser realizados por un miembro']
    },
    comunidad:{
        type: Schema.Types.ObjectId,
        ref: 'Comunidad'
    },
    tipoAviso: {
        type: Number,
        default: 4
    }

});

estructuraAvisos.pre<IAvisos>('save', function( next){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    this.fechaCreacion = dd + '/' + mm + '/' + yyyy;
    
    //this.fechaCreacion = new Date();
    next();
});


interface IAvisos extends Document{

    fechaCreacion: string;
    titulo: string;
    descripcion: string;
    imagenAviso: string[];
    usuario: string;
    comunidad: string;
    tipoAviso: number;

}

export const Avisos= model <IAvisos>('Avisos', estructuraAvisos);