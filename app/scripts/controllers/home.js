'use strict';

angular.module('belissimaApp.controllers')
  .controller('HomeCtrl', ['$scope', '$http', 'URLS', function ($scope, $http, urls) {

    jQuery('.super-logo').width(jQuery(window).width()).height(jQuery(window).height());

    $scope.botoes = [
      {
        nome: 'PDV',
        icone: 'glyphicon-shopping-cart',
        url: '/pdv'
      },
      {
        nome: 'Ticket',
        icone: 'glyphicon-edit',
        url: '/ticket/list'
      },
      {
        nome: 'Serviços &<br>Produtos',
        icone: 'glyphicon-tags',
        url: '/produtos'

      },
      {
        nome: 'Pessoas',
        icone: 'glyphicon-user',
        url: '/pessoas'
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
      // },
      // {
      //   nome: 'Configurações',
      //   icone: 'glyphicon-cog',
      //   url: '/configuracoes'
      }
    ];

    $scope.teste = function() {
      $http.get(urls.home + '', { });
    };

  }]);
