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
    'ProviderComanda',
    'statusId',
    function($rootScope, $scope, $uibModalInstance, provider, Ticket, providerComanda, statusId) {

      $scope.pagination = {
        current: 1,
        max: 10,
        total: 0,
        pageChanged: $scope.getTickets
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

      $scope.getTicketPorComanda = function(comanda) {
        $rootScope.loading.load();
        provider.obterPorComanda(comanda).then(function(success) {
          $rootScope.loading.unload();
          // setResultado(success.data);
          $uibModalInstance.close(new Ticket(Ticket.converterEmEntrada(success.data)));
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
          if (error.status == 404) {
            $rootScope.alerta.show('Comanda ou Ticket não encontrados!');
          }
        });
      };

      $scope.getTicketPorCodigo = function(codigo) {
        $rootScope.loading.load();
        provider.obterPorCodigo(codigo).then(function(success) {
          $rootScope.loading.unload();
          var ticket = new Ticket(Ticket.converterEmEntrada(success.data));
          if (ticket.statusId == 1001) {
            $uibModalInstance.close(ticket);
          } else {
            $rootScope.alerta.show('Ticket não encontrado!');
          }
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
          if (error.status == 404) {
            $rootScope.alerta.show('Ticket não encontrado!');
          }
        });
      };

      $scope.getTickets = function() {
        $rootScope.loading.load();
        provider.obterTodos(true, true, true, true, null, null, null, null, statusId, ($scope.pagination.current - 1) * $scope.pagination.max + ',' + $scope.pagination.max).then(function(success) {
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
