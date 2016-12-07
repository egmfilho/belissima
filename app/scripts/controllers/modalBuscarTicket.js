/**
 * Created by egmfilho on 29/11/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ModalBuscarTicketCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderTicket',
    'Pedido',
    'statusId',
    function($rootScope, $scope, $uibModalInstance, provider, Ticket, statusId) {

      $scope.pagination = {
        current: 1,
        max: 10,
        total: 0
      };

      $scope.resultado = [ ];

      $uibModalInstance.opened.then(function() {
        $scope.getTickets();
      });

      function setResultado(resultado) {
        $scope.resultado = [ ];

        if (angular.isArray(resultado)) {
          angular.forEach(resultado, function(item, index) {
            $scope.resultado.push(new Ticket(Ticket.converterEmEntrada(item)));
          });
        } else {
          $scope.resultado.push(new Ticket(Ticket.converterEmEntrada(resultado)));
          console.log($scope.resultado);
        }
      }

      $scope.getTicketPorCodigo = function(codigo) {
        $rootScope.loading.load();
        provider.obterPorCodigo(codigo).then(function(success) {
          setResultado(success.data);
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
          if (error.status == 404) {
            $rootScope.alerta.show('Nenhum ticket encontrado!');
          }
        });
      };

      $scope.getTickets = function() {
        $rootScope.loading.load();
        provider.obterTodos(true, true, true, true, null, null, null, null, statusId).then(function(success) {
          setResultado(success.data);
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
          if (error.status == 404) {
            $rootScope.alerta.show('Nenhum ticket encontrado!');
          }
        });
      };

      $scope.selecionarTicket = function(ticket) {
        $uibModalInstance.close(ticket);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };

    }]);
