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

      $scope.pagination = {
        current: 1,
        max: 15,
        total: 0,
        pageChanged: function(nome) {
          $scope.getProdutosPorNome(nome);
        }
      };

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
        var limit = ($scope.pagination.current - 1) * $scope.pagination.max + ',' + $scope.pagination.max;
        provider.obterProdutosPorNome(nome, limit).then(function(success) {
          $scope.pagination.total = success.info.product_quantity;
          setResultado(success.data);
        }, function(error) {
          console.log(error);
        });
      };

      $scope.selecionarProduto = function(produto) {
        $uibModalInstance.close(produto);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };

    }]);
