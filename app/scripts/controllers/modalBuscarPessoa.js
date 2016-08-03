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
    'pessoa',
    function($scope, $uibModalInstance, provider, Pessoa, pessoa) {

      $scope.pessoa = { };
      $scope.resultado = [ ];

      if (pessoa) {
        $scope.pessoa = pessoa;
      }

      function setResultado(resultado) {
        $scope.resultado = [ ];

        if (angular.isArray(resultado)) {
          angular.forEach(resultado, function(item, index) {
            $scope.resultado.push(new Pessoa(Pessoa.converterEmEntrada(item)));
          });
        } else {
          $scope.resultado.push(new Pessoa(Pessoa.converterEmEntrada(resultado)));
        }
      }

      $scope.getPessoaPorCodigo = function(codigo) {
        provider.obterPessoaPorCodigo(codigo, true, null, true, true, true, true).then(function(success) {
          console.log(success.data);
          setResultado(success.data);
        }, function(error) {
          console.log(error);
        });
      };

      $scope.getPessoaPorDocumento = function(documento) {
        provider.obterPessoaPorDocumento(documento).then(function(success) {
          setResultado(success.data);
        }, function(error) {
          console.log(error);
        });
      };

      $scope.getPessoasPorNome = function(nome) {
        provider.obterPessoasPorNome(nome).then(function(success) {
          setResultado(success.data);
        }, function(error) {
          console.log(error);
        });
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };

      $scope.ok = function() {
        $uibModalInstance.close($scope.pessoa);
      };

    }]);
