var mongoose = require("mongoose");
//mongoose.connect('mongodb://192.168.254.247:27017/palavras-cruzadas');

var mongoSchema = mongoose.Schema;
// create schema
var perguntas = {
    "pergunta": String,
    "resposta": String,
    "ponto": Number
};
// create model if not exists.
module.exports = mongoose.model('perguntas', perguntas);