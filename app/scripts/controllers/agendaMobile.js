/**
 * Created by egmfilho on 06/01/17.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('AgendaMobileCtrl', AgendaMobileCtrl);

AgendaMobileCtrl.$inject = ['$rootScope', '$scope', 'ProviderEvento', 'Evento'];

function AgendaMobileCtrl($rootScope, $scope, providerEvento, Evento) {

  var self = this;

  $scope.format = 'dd/MM/yyyy';
  $scope.altInputFormats = ['d!/M!/yy'];
  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 0,
    showWeeks: false
  };

  this.data = new Date();

  this.obterEventos = function(funcionarioId, data) {
    if (!funcionarioId || !data) {
      return;
    }

    var dataInicial = new Date(data),
        dataFinal = new Date(data);

    dataInicial.setHours(0);
    dataInicial.setMinutes(0);
    dataInicial.setSeconds(0);

    dataFinal.setHours(23);
    dataFinal.setMinutes(59);
    dataFinal.setSeconds(59);

    $rootScope.loading.load();
    this.eventos = [];
    providerEvento.obterPorFuncionario(funcionarioId, dataInicial, dataFinal).then(function(success) {
      angular.forEach(success.data, function(item, index) {
        self.eventos.push(new Evento(Evento.converterEmEntrada(item)));
      });
      $rootScope.loading.unload();
      console.log(self.eventos);
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

}
