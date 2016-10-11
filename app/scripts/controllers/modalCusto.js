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
    function ($rootScope, $scope, $uibModalInstance, modalConfirm, provider, CustoProduto, Usuario, produto) {

      $uibModalInstance.opened.then(function () {
        $scope.produto = produto;
        $scope.custo = new CustoProduto();
        $scope.custos = [];

        if (produto.custo.produtoId) {
          $scope.custo = new CustoProduto(produto.custo);
        }

        if (produto.id) {
          $rootScope.isLoading = true;
          provider.obterCustosPorIdDeProduto(produto.id, true).then(function (success) {
            angular.forEach(success.data, function (item, index) {
              $scope.custos.push(new CustoProduto(CustoProduto.converterEmEntrada(item)));
            });
            $scope.custos = $scope.custos.sort(function(a, b) {
              return new Date(b.data) - new Date(a.data);
            });
            $rootScope.isLoading = false;
          }, function (error) {
            console.log(error);
            $rootScope.isLoading = false;
          });
        }
      });

      $scope.addCusto = function () {

        if (!$scope.custo.valor) return;

        console.log($scope.custo);

        modalConfirm.show('Novo custo', 'Adicionar novo custo?', 'Sim', 'Não').then(function (result) {
          $scope.custo.produtoId = produto.id;
          $rootScope.isLoading = true;
          provider.salvarCusto(CustoProduto.converterEmSaida($scope.custo)).then(function (success) {
            $scope.custo = new CustoProduto();
            console.log(success.data);
            $scope.custos.unshift(new CustoProduto(CustoProduto.converterEmEntrada(success.data)));
            $rootScope.isLoading = false;
          }, function (error) {
            console.log(error);
            $rootScope.isLoading = false;
          });
        });
      };

      $scope.fechar = function () {
        $uibModalInstance.close($scope.custos[0]);
      };

    }]);
