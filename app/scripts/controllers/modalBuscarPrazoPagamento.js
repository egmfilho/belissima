/**
 * Created by egmfilho on 22/11/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ModalBuscarPrazoPagamentoCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderPrazoPagamento',
    'PrazoPagamento',
    function($rootScope, $scope, $uibModalInstance, provider, PrazoPagamento) {

      $scope.resultado = [ ];

      $uibModalInstance.opened.then(function() {
        obterTodos();
      });

      function setResultado(resultado) {
        $scope.resultado = [ ];

        if (angular.isArray(resultado)) {
          angular.forEach(resultado, function(item, index) {
            $scope.resultado.push(new PrazoPagamento(PrazoPagamento.converterEmEntrada(item)));
          });
        } else {
          $scope.resultado.push(new PrazoPagamento(PrazoPagamento.converterEmEntrada(resultado)));
          console.log($scope.resultado);
        }
      }

      function obterTodos() {
        $rootScope.loading.load();
        provider.obterTodos().then(function(success) {
          setResultado(success.data);
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      $scope.getPrazoPorCodigo = function(codigo) {
        provider.obterPorCodigo(codigo).then(function(success) {
          setResultado(success.data);
        }, function(error) {
          console.log(error);
        });
      };

      $scope.getPrazoPorDescricao = function(nome) {
        provider.obterPorDescricao(nome).then(function(success) {
          setResultado(success.data);
        }, function(error) {
          console.log(error);
        });
      };

      $scope.selecionar = function(prazo) {
        if (!prazo.formas.length) {
          provider.obterPorCodigo(prazo.codigo).then(function(success) {
            $uibModalInstance.close(new PrazoPagamento(PrazoPagamento.converterEmEntrada(success.data)));
          }, function(error) {
            console.log(error);
          });
        } else {
          $uibModalInstance.close(prazo);
        }
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };

    }]);
