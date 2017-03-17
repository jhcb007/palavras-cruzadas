var mongoose = require("mongoose");

var mongoSchema = mongoose.Schema;
// create schema
var trumas = {
    "nome": String
};
// create model if not exists.
module.exports = mongoose.model('turmas', trumas);