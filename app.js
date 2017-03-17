/**
 * Created by Henrique Brandão on 14/03/2017.
 */
'use strict';
var app = angular.module('appPalavraCruzadas', ['ngRoute', 'moduloGeral']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/inicio', {
            templateUrl: 'view/login_aluno.html',
            controller: 'InicioController'
        })
        .when('/turmas', {
            templateUrl: 'view/turmas.html',
            controller: 'TurmasController'
        })
        .when('/turmas/:turma/perguntas', {
            templateUrl: 'view/perguntas.html',
            controller: 'PerguntasController'
        })
        .when('/professor', {
            templateUrl: 'view/turmas_professor.html',
            controller: 'TurmasProfessorController'
        })
        .when('/professor/:turma', {
            templateUrl: 'view/professor.html',
            controller: 'ProfessorController'
        })
        .when('/professor/:turma/:aluno', {
            templateUrl: 'view/professor_aluno.html',
            controller: 'ProfessorAlunoController'
        })
        .otherwise({
            redirectTo: '/inicio'
        });
});