/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .controller('ModalBuscarPessoaCtrl', [
    '$scope',
    '$uibModalInstance',
    'ProviderPessoa',
    'Pessoa',
    'categoriaId',
    function($scope, $uibModalInstance, provider, Pessoa, categoriaId) {

      $scope.selecionado = { };
      $scope.resultado = [ ];

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
        provider.obterPessoaPorCodigo(codigo, true, true, true, true, true, true, true, categoriaId).then(function(success) {
          setResultado(success.data);
        }, function(error) {
          console.log(error);
        });
      };

      $scope.getPessoaPorDocumento = function(documento) {
        provider.obterPessoasPorDocumento(documento, true, true, true, true, true, true, true, categoriaId).then(function(success) {
          setResultado(success.data);
        }, function(error) {
          console.log(error);
        });
      };

      $scope.getPessoasPorNome = function(nome) {
        provider.obterPessoasPorNome(nome, true, true, true, true, true, true, true, categoriaId).then(function(success) {
          setResultado(success.data);
        }, function(error) {
          console.log(error);
        });
      };

      $scope.selecionarPessoa = function(pessoa) {
        $scope.selecionado = pessoa;
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };

      $scope.ok = function() {
        $uibModalInstance.close($scope.selecionado);
      };

    }]);
