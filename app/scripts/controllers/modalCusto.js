/**
 * Created by egmfilho on 11/08/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ModalCustoCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ModalConfirm',
    'ProviderCusto',
    'CustoProduto',
    'Usuario',
    'produto',
    function($rootScope, $scope, $uibModalInstance, modalConfirm, provider, CustoProduto, Usuario, produto) {

      (function() {
        $scope.produto = produto;
        $scope.custo = new CustoProduto();
        $scope.custos = [ ];

        if (!produto.custo.produtoId) {
          $scope.custo = produto.custo;
          $scope.custos.push($scope.custo);
        }

        if (produto.id) {
          provider.obterCustosPorIdDeProduto(produto.id, true).then(function(success) {
            angular.forEach(success.data, function(item, index) {
              $scope.custos.push(new CustoProduto(CustoProduto.converterEmEntrada(item)));
            });
          }, function(error) {
            console.log(error);
          });
        }
      }());

      $scope.addCusto = function() {

        if (!$scope.custo.valor) return;

        console.log($scope.custo);

        modalConfirm.show('Novo custo', 'Adicionar novo custo?', 'Sim', 'Não', function(result) {
          if (result) {
            $scope.custo.produtoId = produto.id;
            provider.salvarCusto(CustoProduto.converterEmSaida($scope.custo)).then(function(success) {
              $scope.custo = new CustoProduto();
              $scope.custos.push(new CustoProduto(CustoProduto.converterEmEntrada(success.data)));
            }, function(error) {
              console.log(error);
            });
          }
        });
      };

      $scope.fechar = function() {
        $uibModalInstance.close($scope.custo.valor ? $scope.custo : null);
      };

    }]);
