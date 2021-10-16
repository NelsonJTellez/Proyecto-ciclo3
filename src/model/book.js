const mongoose  = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        titulo:{type: String, required: true, index: true, trim: true}, 
        autor:{ type: String, required: true, index: true},
        genero:{ type:String, required: true},       
        descripcion:{ type: String, required: true, trim:true },
    }
);

module.exports = mongoose.model('book',bookSchema);