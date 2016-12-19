/**
 * Created by egmfilho on 19/12/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('MovimentacaoCtrl', MovimentacaoCtrl);

MovimentacaoCtrl.$inject = [
  '$rootScope',
  '$scope'
];

function MovimentacaoCtrl($rootScope, $scope) {

  $scope.format = 'dd/MM/yy';
  $scope.dateOptions = {
    formatYear: 'yy',
    minDate: new Date(),
    startingDay: 0,
    showWeeks: false
  };

  $scope.pagination = {
    current: 1,
    max: 15,
    total: 0,
    pageChanged: function () {
      getMovimentacoes();
    }
  };

  function getMovimentacoes() {

  }

  this.abrirModalInserir = function() {
    jQuery('#modalInserir').modal('show');
  }

}
