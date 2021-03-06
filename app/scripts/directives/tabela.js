/**
 * Created by egmfilho on 21/07/16.
 */
'use strict';

angular.module('belissimaApp.directives')
  .directive('tabela', [function() {

    function link(scope, element, attrs) {
      var table = element.find('table');

      console.log(table.css('width'));
      console.log(table.css('min-width'));

      if (parseInt(table.css('width')) <= parseInt(table.css('min-width'))) {
        angular.element('table > tbody').css('padding-bottom', '18px');

        console.log('tabela directive reajustada');
      }
    }

    function controller($scope) {
      $scope.template = './partials/popoverTabela.html';
    }

    return {
      restrict: 'E',
      scope: {
        idTabela: '@',
        head: '=',
        body: '=',
        callbackEditar: '=',
        callbackExcluir: '='
      },
      templateUrl: 'partials/tabela.html',
      link: link,
      controller: controller
    };
  }]);
