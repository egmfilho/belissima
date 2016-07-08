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
        icone: 'glyphicon-tag'
      },
      {
        nome: 'Clientes',
        icone: 'glyphicon-user'
      },
      {
        nome: 'Relatórios',
        icone: 'glyphicon-print'
      },
      {
        nome: 'Agenda',
        icone: 'glyphicon-calendar'
      },
      {
        nome: 'Configurações',
        icone: 'glyphicon-cog'
      },
    ];

    $scope.teste = function() {
      $http.get(urls.home, { });
    };

  }]);
