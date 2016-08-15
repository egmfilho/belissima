/**
 * Created by egmfilho on 08/08/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ModalBuscarProdutoCtrl', [
    '$scope',
    '$uibModalInstance',
    'ProviderProduto',
    'Produto',
    function($scope, $uibModalInstance, provider, Produto) {

      $scope.selecionado = { };
      $scope.resultado = [ ];

      function setResultado(resultado) {
        $scope.resultado = [ ];

        if (angular.isArray(resultado)) {
          angular.forEach(resultado, function(item, index) {
            $scope.resultado.push(new Produto(Produto.converterEmEntrada(item)));
          });
        } else {
          $scope.resultado.push(new Produto(Produto.converterEmEntrada(resultado)));
          console.log($scope.resultado);
        }
      }

      $scope.getProdutoPorCodigo = function(codigo) {
        provider.obterProdutoPorCodigo(codigo).then(function(success) {
          setResultado(success.data);
        }, function(error) {
          console.log(error);
        });
      };

      $scope.getProdutosPorNome = function(nome) {
        provider.obterProdutosPorNome(nome).then(function(success) {
          setResultado(success.data);
        }, function(error) {
          console.log(error);
        });
      };

      $scope.selecionarProduto = function(produto) {
        $scope.selecionado = produto;
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };

      $scope.ok = function() {
        $uibModalInstance.close($scope.selecionado);
      };

    }]);
