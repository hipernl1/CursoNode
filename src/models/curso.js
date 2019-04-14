const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const cursoSchema = new Schema({
    id:{
        type: Number,
        required: [true, 'El id del curso es obligatorio.'],
        unique:true
    },
    nombreCurso : {
        type: String,
        require: [true, 'El nombre del curso es obligatorio.'],
        trim: true
    },
    descripcion : {
        type: String,
        require: [true, 'La descripción del curso es obligatoria.'],
        trim: true
    },
    valor :{
        type: Number,
        require: [true, 'El valor del curso es obligatorio.'],
    },
    modalidad : {
        type: String,
        enum: {values: ['Virtual', 'Presencial'], message:'La modalidad no esta dentro de los valores permitidos.'},
        required: false
    },
    intensidad :{
        type: Number,
        required: false
    },
    estado : {
        type: String,
        enum: {values: ['Disponible', 'Cerrado'], message:'El estado no esta dentro de los valores permitidos.'}
    },
});

cursoSchema.plugin(uniqueValidator);
const Curso = mongoose.model("Curso", cursoSchema);

module.exports = Curso;