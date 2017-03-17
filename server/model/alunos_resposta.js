var mongoose = require("mongoose");
//mongoose.connect('mongodb://192.168.254.247:27017/palavras-cruzadas');

var mongoSchema = mongoose.Schema;
// create schema
var alunos_resposta = {
    "aluno": {type: mongoSchema.Types.ObjectId},
    "resposta": String
};
// create model if not exists.
module.exports = mongoose.model('alunos_resposta', alunos_resposta);