/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .controller('ServicoProdutosCtrl', ['$scope', function($scope) {

    function compensaScrollsNaTabela() {

      var tabela = angular.element('#tabela-produtos');

      if (navigator.platform !== 'MacIntel') {
        angular.element('#tabela-produtos thead tr').css('padding-right', '18px');
      }

      console.log(parseInt(tabela.css('width')));
      console.log(parseInt(tabela.css('min-width')));

      if (parseInt(tabela.css('width')) <= parseInt(tabela.css('min-width'))) {
        console.log('teste');
        angular.element('#tabela-produtos > tbody').css('padding-bottom', '18px');
      }
    }

    $scope.$on('$viewContentLoaded', function() {
      //console.log(angular.element('#tabela-produtos'));
    });

    $scope.head = ['dog', 'dogie', 'bayern', 'banana', 'lucilei', 'minion'];
    $scope.body = [{}];

  }]);
