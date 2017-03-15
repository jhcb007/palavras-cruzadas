var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require('cors')
var alunos = require("./model/alunos.js");
var turmas = require("./model/turmas.js");
var perguntas = require("./model/perguntas.js");
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": false}));

app.use(cors({origin: 'http://192.168.254.247:8002'}));

router.get("/", function (req, res) {
    res.json({"error": false, "message": "Hello World"});
});

router.route("/api/alunos")
    .get(function (req, res) {
        var response = {};
        alunos.find({}, function (err, data) {
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
            // Mongo command to fetch all data from collection.
            if (err) {
                response = {"status": false, "dado": "Error fetching data"};
            } else {
                response = {"status": true, "dado": data};
            }
            res.json(response);
        });
    });

app.use('/', router);

app.listen(3000);
console.log("Listening to PORT 3000");

//http-server -a 192.168.254.247  -p 8002 -c-1