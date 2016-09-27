/**
 * Created by egmfilho on 10/08/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ModalGrupoCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderGrupo',
    'GrupoProduto',
    function($rootScope, $scope, $uibModalInstance, provider, GrupoProduto) {

      $uibModalInstance.opened.then(function() {
        $rootScope.isLoading = false;
        $scope.grupo = {};
        $scope.grupos = [ ];

        $rootScope.isLoading = true;
        provider.obterTodos(true).then(function(success) {
          angular.forEach(success.data, function(item, index) {
            $scope.grupos.push(new GrupoProduto(GrupoProduto.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      });

      $scope.getGrupoPorCodigo = function() {
        if (!$scope.grupo.codigo) return;

        $rootScope.isLoading = true;
        provider.obterPorCodigo($scope.grupo.codigo).then(function(success) {
          $scope.grupo = new GrupoProduto(GrupoProduto.converterEmEntrada(success.data));
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      $scope.selecionar = function(node) {
        $uibModalInstance.close(node);
      };

      $scope.fechar = function() {
        $uibModalInstance.dismiss();
      }

    }]);
