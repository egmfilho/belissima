'use strict';

angular.module('belissimaApp')
  .controller('HomeCtrl', ['$scope', function ($scope) {

    $scope.botoes = [
      {
        nome: 'Ticket',
        icone: 'glyphicon-shopping-cart',
        url: '/ticket'
      },
      {
        nome: 'Produtos',
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

  }]);
