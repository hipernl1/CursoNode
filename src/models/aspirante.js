const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const aspiranteSchema = new Schema({
    documento:{
        type: Number,
        required: [true, 'El documento es obligatorio.'],
        unique:true
    },
    nombre : {
        type: String,
        require: [true, 'El nombre del es obligatorio.'],
        trim: true
    },
    email : {
        type: String,
        require: [true, 'La email es obligatoria.'],
        trim: true
    },
    telefono :{
        type: Number,
        require: [true, 'El teléfono es obligatorio.'],
    }
});

aspiranteSchema.plugin(uniqueValidator);
const Aspirante = mongoose.model("Aspirante", aspiranteSchema);

module.exports = Aspirante;