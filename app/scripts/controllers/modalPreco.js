/**
 * Created by egmfilho on 09/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .controller('ModalPrecoCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderPreco',
    'PrecoProduto',
    'Usuario',
    'produto',
    function($rootScope, $scope, $uibModalInstance, provider, PrecoProduto, Usuario, produto) {

      (function() {
        $scope.produto = produto;
        $scope.preco = new PrecoProduto();
        $scope.precos = [ ];

        if (!produto.preco.produtoId) {
          $scope.preco = produto.preco;
          $scope.precos.push($scope.preco);
        }

        if (produto.id) {
          provider.obterPrecosPorIdDeProduto(produto.id, true).then(function(success) {
            angular.forEach(success.data, function(item, index) {
              $scope.precos.push(new PrecoProduto(PrecoProduto.converterEmEntrada(item)));
            });
          }, function(error) {
            console.log(error);
          });
        }
      }());

      $scope.addPreco = function() {
        $scope.preco.data = new Date();
        $scope.preco.user = new Usuario($rootScope.usuario);
        $scope.precos.push(new PrecoProduto($scope.preco));
      };

      $scope.fechar = function() {
        $uibModalInstance.close($scope.preco.valor ? $scope.preco : null);
      };

    }]);
