'use strict';

angular.module('moduloGeral', ['servicoGeral'])
    .controller('InicioController', InicioController)
    .controller('TurmasController', TurmasController)
    .controller('PerguntasController', PerguntasController)
    .controller('TurmasProfessorController', TurmasProfessorController)
    .controller('ProfessorController', ProfessorController)
    .controller('ProfessorAlunoController', ProfessorAlunoController);

function InicioController($rootScope, config) {
    $rootScope._dev = config.nomeAPP + config.desenvolvedor;
}

function TurmasController($rootScope, $scope, Turmas) {
    Turmas.get({}, function (resul) {
        $scope.turmas = resul.dado;
    });
    $rootScope._aluno_id = _ID_FACEBOOK;
    $rootScope._aluno = _NOME;
    $scope.acessaTurma = function (turma) {
        $rootScope._turma = turma;
    }
}

function PerguntasController($rootScope, $scope, Aluno, Perguntas) {

    var array_pergunta = [];

    $scope.atualizaAlunos = function () {
        Aluno.get({}, function (resul) {
            $scope.alunos = resul.dado;
            angular.forEach($scope.alunos, function (value, key) {
                if ($rootScope._aluno_id == value.id_facebook) {
                    $rootScope._aluno_banco_id = value._id;
                    $rootScope._aluno_pontuacao = value.pontuacao;
                    _ID_ALUNO = $rootScope._aluno_banco_id;
                    _PONTUACAO = $rootScope._aluno_pontuacao;
                    $rootScope._posicao = key + 1;
                }
            });
        });
    };

    Perguntas.get({}, function (resul) {
        $rootScope._perguntas = [];
        angular.forEach(resul.dado, function (value, key) {
            var obj = {
                pergunta: value.pergunta,
                resposta: value.resposta,
                status: false
            }
            $rootScope._perguntas.push(obj);
            array_pergunta.push(value.resposta);
        });
        jQuery(function ($) {
            $('#canvas').puzzle({
                words: array_pergunta
                , cols: 32
                , rows: 25
            });
        });
    });

    $scope.atualizaAlunos();

    setInterval(function () {
        $scope.atualizaAlunos();
    }, 2000);


}

function TurmasProfessorController($rootScope, $scope, Turmas, Perguntas) {
    Turmas.get({}, function (resul) {
        $scope.turmas = resul.dado;
    });

    Perguntas.get({}, function (resul) {
        $rootScope._perguntas = resul.dado;
    });

    $scope.acessaTurma = function (turma) {
        $rootScope._turma = turma;
    }
}

function ProfessorController($rootScope, $routeParams, $scope, Aluno, Perguntas) {

    $scope.turma_link = $routeParams.turma;

    $scope.atualizaAlunos = function () {
        Aluno.get({}, function (resul) {
            $scope.alunos = resul.dado;
        });
    };

    Perguntas.get({}, function (resul) {
        $rootScope._perguntas = resul.dado;
    });

    $scope.atualizaAlunos();

    setInterval(function () {
        $scope.atualizaAlunos();
    }, 2000);

}

function ProfessorAlunoController($rootScope, $routeParams, $scope, Aluno, AlunosRespostas) {

    $scope.turma_link = $routeParams.turma;

    Aluno.get({}, function (resul) {
        $scope.alunos = resul.dado;
        angular.forEach($scope.alunos, function (value, key) {
            if ($routeParams.aluno == value._id) {
                $scope.aluno = value.nome;
                $scope.posicao = key + 1;
                return;
            }
        });
    });

    AlunosRespostas.save({}, {aluno: $routeParams.aluno}, function (resul) {
        var perguntas = [];
        angular.forEach(resul.dado, function (r_value, r_key) {
            angular.forEach($rootScope._perguntas, function (p_value, p_key) {
                if (r_value.resposta == p_value.resposta) {
                    perguntas.push(p_value);
                }
            });
        });
        $scope.perguntas_aluno = perguntas;
    });

}
