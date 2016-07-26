'use strict';

angular.module('belissimaApp')
  .controller('HomeCtrl', ['$scope', '$http', 'URLS', function ($scope, $http, urls) {

    $scope.botoes = [
      {
        nome: 'Ticket',
        icone: 'glyphicon-shopping-cart',
        url: '/ticket'
      },
      {
        nome: 'Serviços &<br>Produtos',
        icone: 'glyphicon-tags',
        url: '/produtos'

      },
      {
        nome: 'Clientes',
        icone: 'glyphicon-user',
        url: '/clientes'
      },
      {
        nome: 'Relatórios',
        icone: 'glyphicon-print',
        url: '/relatorios'
      },
      {
        nome: 'Agenda',
        icone: 'glyphicon-calendar',
        url: '/agenda'
      },
      {
        nome: 'Configurações',
        icone: 'glyphicon-cog',
        url: '/configuracoes'
      },
    ];

    $scope.teste = function() {
      $http.get(urls.home + '', { });
    };

  }]);
