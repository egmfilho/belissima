/**
 * Created by egmfilho on 14/09/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ModalBuscarEnderecoCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderCEP',
    'CEP',
    'enderecos',
    function($rootScope, $scope, $uibModalInstance, provider, CEP, enderecos) {

      $uibModalInstance.opened.then(function() {
        $scope.ceps = enderecos || [ ];
        $scope.tabela_vazia = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
        $rootScope.isLoading = false;
        setTimeout(function() {
          jQuery('input[name="cdCEP"]').focus();
        }, 300);
      });

      $scope.avancar = function() {
        jQuery('input[name="cidade"]').focus();
      };

      $scope.buscarPorCEP = function(cep) {
        if (!cep || cep.length < 9) {
          alert('Informe corretamente um CEP!');
          return;
        }

        $rootScope.isLoading = true;
        provider.obterPorCodigo(cep, true, true).then(function(success) {
          $scope.ceps = [ ];
          angular.forEach(success.data, function (item, index) {
            $scope.ceps.push(new CEP(CEP.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      $scope.buscarPorLogradouro = function(logradouro) {
        if(!$scope.logradouro) {
          alert('Preencha corretamente!');
          return;
        }

        $rootScope.isLoading = true;
        provider.obterPorLogradouro(logradouro, true, true).then(function(success) {
          $scope.ceps = [ ];
          angular.forEach(success.data, function(item, index) {
            $scope.ceps.push(new CEP(CEP.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      $scope.selecionarCEP = function(cep) {
        $uibModalInstance.close(cep);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };
    }
  ]);
