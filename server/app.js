var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require('cors');
var alunos = require("./model/alunos.js");
var turmas = require("./model/turmas.js");
var perguntas = require("./model/perguntas.js");
var alunos_resposta = require("./model/alunos_resposta");
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": false}));

app.use(cors({origin: '*'}));

router.get("/", function (req, res) {
    res.json({"error": false, "message": "Hello World"});
});

router.route("/api/alunos")
    .get(function (req, res) {
        var response = {};
        alunos
            .find({})
            .sort({pontuacao: 'descending'})
            .exec(function (err, data) {
                if (err) {
                    response = {"status": false, "dado": "Error fetching data"};
                } else {
                    response = {"status": true, "dado": data};
                }
                res.json(response);
            });
    })
    .post(function (req, res) {
        var db = new alunos();
        var response = {};
        db.nome = req.body.nome;
        db.id_facebook = req.body.id_facebook;
        db.pontuacao = 0;
        alunos.find({id_facebook: req.body.id_facebook}, function (err, data) {
            if (err) {
                response = {"status": false, "dado": "Erro no Banco de dados."};
                res.json(response);
            } else {
                if (data.length == 0) {
                    db.save(function (err) {
                        if (err) {
                            response = {"status": false, "dado": "Error adding data"};
                        } else {
                            response = {"status": true, "dado": "Aluno ativo"};
                        }
                        res.json(response);
                    });
                } else {
                    response = {"status": true, "dado": "Aluno ativo"};
                    res.json(response);
                }
            }
        });
    })
    .put(function (req, res) {
        var db = new alunos_resposta();
        var response = {};
        db.resposta = req.body.resposta;
        db.aluno = req.body._id;
        req.body.pontuacao = (req.body.pontuacao + 1);
        db.save(function (err) {
            if (err) {
                response = {"status": false, "dado": "Error adding data"};
                res.json(response);
            } else {
                alunos.findByIdAndUpdate(req.body._id, {pontuacao: req.body.pontuacao}, function (err) {
                    if (err) {
                        response = {"status": false, "dado": "Error fetching data"};
                    } else {
                        response = {"status": true, "dado": "Pontuação Atualizada"};
                    }
                    res.json(response);
                });
            }
        });
    });

router.route("/api/turmas")
    .get(function (req, res) {
        var response = {};
        turmas.find({}, function (err, data) {
            if (err) {
                response = {"status": false, "dado": "Error fetching data"};
            } else {
                response = {"status": true, "dado": data};
            }
            res.json(response);
        });
    });

router.route("/api/perguntas")
    .get(function (req, res) {
        var response = {};
        perguntas.find({}, function (err, data) {
            if (err) {
                response = {"status": false, "dado": "Error fetching data"};
            } else {
                response = {"status": true, "dado": data};
            }
            res.json(response);
        });
    });

router.route("/api/alunos_resposta")
    .post(function (req, res) {
        var response = {};
        alunos_resposta
            .find({})
            .where('aluno', req.body.aluno)
            .exec(function (err, data) {
                if (err) {
                    response = {"status": false, "dado": "Error fetching data"};
                } else {
                    response = {"status": true, "dado": data};
                }
                res.json(response);
            });
    });

app.use('/', router);

app.listen(8080);
console.log("Listening to PORT 8080");

//http-server -a 192.168.254.247  -p 8002 -c-1