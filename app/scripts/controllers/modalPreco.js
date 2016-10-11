/**
 * Created by egmfilho on 09/08/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ModalPrecoCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ModalConfirm',
    'ProviderPreco',
    'PrecoProduto',
    'Usuario',
    'produto',
    function($rootScope, $scope, $uibModalInstance, modalConfirm, provider, PrecoProduto, Usuario, produto) {

      (function() {
        $scope.produto = produto;
        $scope.preco = new PrecoProduto();
        $scope.precos = [ ];

        if (produto.preco.produtoId) {
          $scope.preco = new PrecoProduto(produto.preco);
        }

        if (produto.id) {
          $rootScope.isLoading = true;
          provider.obterPrecosPorIdDeProduto(produto.id, true).then(function(success) {
            angular.forEach(success.data, function(item, index) {
              $scope.precos.push(new PrecoProduto(PrecoProduto.converterEmEntrada(item)));
            });
            $scope.precos = $scope.precos.sort(function (a, b) {
              return new Date(b.data) - new Date(a.data);
            });
            $rootScope.isLoading = false;
          }, function(error) {
            console.log(error);
            $rootScope.isLoading = false;
          });
        }
      }());

      $scope.addPreco = function() {

        if (!$scope.preco.valor) return;

        console.log($scope.preco);

        modalConfirm.show('Novo preço', 'Adicionar novo preço?', 'Sim', 'Não').then(function(result) {
          $scope.preco.produtoId = produto.id;
          $rootScope.isLoading = true;
          provider.salvarPreco(PrecoProduto.converterEmSaida($scope.preco)).then(function(success) {
            $scope.preco = new PrecoProduto();
            $scope.precos.unshift(new PrecoProduto(PrecoProduto.converterEmEntrada(success.data)));
            $rootScope.isLoading = false;
          }, function(error) {
            console.log(error);
            $rootScope.isLoading = false;
          });
        });
      };

      $scope.fechar = function() {
        $uibModalInstance.close($scope.precos[0]);
      };

    }]);
