
import {Schema, Document, model} from 'mongoose';

const estructuraAcuerdos = new Schema({

        titulo: {
            type: String,
            required: [true, 'El titulo es obligatorio']
        },
        descripcion: {
            type: String,
            required: [true, 'La descripcion es obligatoria']
        },
        fecha: {
            type: Date
        },/* 
        hora:{
           type: Date
        }, */
        imagenAcuerdo: [{
            type: String
        }],
         opciones:[{
            titulo: {
                type: String,
                //required: [true, 'El titulo es obligatorio']
            },
            descripcion: {
                type: String,
                //required: [true, 'La descripcion es obligatoria']
            }
        }],
        usuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario'
            //required: [true, 'Los avisos deben ser realizados por un miembro']
        },
        comunidad:{
            type: Schema.Types.ObjectId,
            ref: 'Comunidad'
            //required: [true, 'Los acuerdos deben pertenecer a una comunidad']
        }
    
});

interface IAcuerdos extends Document{

    titulo: string;
    descripcion: string;
    fecha: Date;
    //hora: Date;
    imagenAcuerdo: string;
    opciones: string[];
    usuario: string;
    comunidad: string;
}

export const Acuerdos= model <IAcuerdos>('Acuerdos', estructuraAcuerdos);