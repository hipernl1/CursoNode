const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const aspiranteCursoSchema = new Schema({
    cursoId:{
        type: Number,
        required: [true, 'El id del curso es obligatorio.']
    },
    documento : {
        type: Number,
        require: [true, 'El documento es obligatorio.']
    }
});

aspiranteCursoSchema.plugin(uniqueValidator);
const AspiranteCurso = mongoose.model("AspiranteCurso", aspiranteCursoSchema);

module.exports = AspiranteCurso;