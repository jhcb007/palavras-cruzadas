var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/palavras-cruzadas');

var mongoSchema = mongoose.Schema;
// create schema
var alunos = {
    "nome": String,
    "id_facebook": {type: Number, unique: true},
    "pontuacao": Number
};
// create model if not exists.
module.exports = mongoose.model('alunos', alunos);