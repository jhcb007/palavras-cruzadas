'use strict';

angular.module('moduloGeral', ['servicoGeral'])
    .controller('InicioController', InicioController)
    .controller('TurmasController', TurmasController)
    .controller('PerguntasController', PerguntasController);

function InicioController($rootScope, $scope, config, Aluno) {

    $rootScope._dev = config.nomeAPP + ' - ' + config.desenvolvedor;

    $scope.setAluno = function (dados) {
        var set = {
            nome: dados.name,
            id_facebook: dados.id
        };
        Aluno.save({}, set, function (resul) {
            if (resul.status) {
                window.location.href = '/#turmas';
            }
        });
    };

    function statusChangeCallback(response) {
        if (response.status === 'connected') {
            testAPI();
        } else {
            document.getElementById('status').innerHTML = 'Você não está logado';
        }
    }

    function checkLoginState() {
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });
    }

    window.fbAsyncInit = function () {
        FB.init({
            appId: '1061421020656966',
            cookie: true,  // enable cookies to allow the server to access
            xfbml: true,  // parse social plugins on this page
            version: 'v2.8' // use graph api version 2.8
        });
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v2.8";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    function testAPI() {
        FB.api('/me', function (response) {
            $rootScope._aluno = response.name;
            $rootScope._aluno_id = response.id;
            $scope.setAluno(response);
            document.getElementById('status').innerHTML = 'Você está logado como ' + response.name + '!';
        });
    }
}

function TurmasController($rootScope, $scope, Turmas) {
    Turmas.get({}, function (resul) {
        $scope.turmas = resul.dado;
        console.log($scope.turmas);
    });

    $scope.acessaTurma = function (turma) {
        $rootScope._turma = turma;
    }
}

function PerguntasController($rootScope, $scope, Aluno) {

    $scope.atualizaAlunos = function () {
        Aluno.get({}, function (resul) {
            $scope.alunos = resul.dado;
            angular.forEach($scope.alunos, function (value, key) {
                if ($rootScope._aluno_id == value.id_facebook) {
                    $rootScope._aluno_banco_id = value._id;
                    $rootScope._aluno_pontuacao = value.pontuacao;
                    _ID_ALUNO = $rootScope._aluno_banco_id;
                    _PONTUACAO = $rootScope._aluno_pontuacao;
                }
            });
        });
    };

    $scope.atualizaAlunos();

    setInterval(function () {
        $scope.atualizaAlunos();
    }, 2000);


    jQuery(function ($) {
        $('#canvas').puzzle({
            words: ['ARARAQUARA', 'SETEMBRO', 'AVIADOR', 'ANADOR', 'QUEDA DA BASTILHA']
            , cols: 32
            , rows: 25
        });
    });
}