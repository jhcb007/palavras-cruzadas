'use strict';
angular.module('servicoGeral', ['ngResource'])
    .factory('Aluno', function ($resource, config) {
        return $resource(config.baseURL + 'api/alunos', {}, {
            'get': {
                method: 'GET'
            },
            'update': {
                method: 'PUT'
            },
            save: {
                method: 'POST'
            }
        });
    })
    .factory('Turmas', function ($resource, config) {
        return $resource(config.baseURL + 'api/turmas', {}, {
            'get': {
                method: 'GET'
            },
            save: {
                method: 'POST'
            }
        });
    })
    .factory('Perguntas', function ($resource, config) {
        return $resource(config.baseURL + 'api/perguntas', {}, {
            'get': {
                method: 'GET'
            },
            save: {
                method: 'POST'
            },
            'update': {
                method: 'PUT'
            }
        });
    })
    .factory('AlunosRespostas', function ($resource, config) {
        return $resource(config.baseURL + 'api/alunos_resposta', {}, {
            'get': {
                method: 'GET'
            },
            save: {
                method: 'POST'
            },
            'update': {
                method: 'PUT'
            }
        });
    });

