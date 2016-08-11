/**
 * Created by egmfilho on 09/08/16.
 */

'use strict';

angular.module('belissimaApp')
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

        if (!$scope.preco.valor) return;

        console.log($scope.preco);

        modalConfirm.show('Novo preço', 'Adicionar novo preço?', 'Sim', 'Não', function(result) {
          if (result) {
            $scope.preco.produtoId = produto.id;
            provider.salvarPreco(PrecoProduto.converterEmSaida($scope.preco)).then(function(success) {
              $scope.preco = new PrecoProduto();
              $scope.precos.push(new PrecoProduto(PrecoProduto.converterEmEntrada(success.data)));
            }, function(error) {
              console.log(error);
            });
          }
        });
      };

      $scope.fechar = function() {
        $uibModalInstance.close($scope.precos[$scope.precos.length - 1]);
      };

    }]);
