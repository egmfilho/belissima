/**
 * Created by egmfilho on 21/06/16.
 */
'use strict';
angular.module('belissimaApp')
  .controller('TicketCtrl', ['$scope', function ($scope) {

    $scope.inicial = new Date();
    $scope.final = new Date();

    $scope.format = 'dd/MM/yy';
    $scope.altInputFormats = ['d!/M!/yy'];

    $scope.dateOptionsInicial = {
      dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(), // Hoje
      //minDate: new Date(2016, 5, 1),
      startingDay: 0,
      showWeeks: false,
    };

    $scope.dateOptionsFinal = {
      dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(), // Hoje
      minDate: $scope.inicial,
      startingDay: 0,
      showWeeks: false
    };

    // Desabilita dias
    function disabled(data) {
      var date = data.date,
        mode = data.mode;

      // Desabilita finais de semana
      //return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);

      return false;
    }

    $scope.abrirInicial = function() {
      $scope.popupInicial.opened = true;
    };

    $scope.popupInicial = {
      opened: false
    };

    $scope.abrirFinal = function() {
      $scope.popupFinal.opened = true;
    };

    $scope.popupFinal = {
      opened: false
    };

    $scope.trocaMinDataFinal = function() {
      $scope.dateOptionsFinal.minDate = $scope.inicial;
    };

}]);
