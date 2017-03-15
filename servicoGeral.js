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
    .factory('Login', function ($resource, config) {
        return $resource(config.baseURL + 'api/login', {}, {
            save: {
                method: 'POST'
            },
            'update': {
                method: 'PUT'
            }
        });
    });

