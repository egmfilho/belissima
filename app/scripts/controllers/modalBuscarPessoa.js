/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ModalBuscarPessoaCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderPessoa',
    'Pessoa',
    'categoriaId',
    function($rootScope, $scope, $uibModalInstance, provider, Pessoa, categoriaId) {

      $uibModalInstance.opened.then(function() {
        $rootScope.isLoading = false;
        $scope.resultado = [ ];
      });

      function setResultado(resultado) {
        $scope.resultado = [ ];

        if (angular.isArray(resultado)) {
          angular.forEach(resultado, function(item, index) {
            $scope.resultado.push(new Pessoa(Pessoa.converterEmEntrada(item)));
          });
        } else {
          $scope.resultado.push(new Pessoa(Pessoa.converterEmEntrada(resultado)));
          console.log($scope.resultado);
        }
      }

      $scope.getPessoaPorCodigo = function(codigo) {
        $rootScope.isLoading = true;
        provider.obterPessoaPorCodigo(codigo, true, true, true, true, true, true, true, categoriaId).then(function(success) {
          setResultado(success.data);
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      $scope.getPessoaPorDocumento = function(documento) {
        $rootScope.isLoading = true;
        provider.obterPessoasPorDocumento(documento, true, true, true, true, true, true, true, categoriaId).then(function(success) {
          setResultado(success.data);
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      $scope.getPessoasPorNome = function(nome) {
        $rootScope.isLoading = true;
        provider.obterPessoasPorNome(nome, true, true, true, true, true, true, true, categoriaId).then(function(success) {
          setResultado(success.data);
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      $scope.selecionarPessoa = function(pessoa) {
        $uibModalInstance.close(pessoa);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };

    }]);
