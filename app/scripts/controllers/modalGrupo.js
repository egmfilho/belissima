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
        $rootScope.loading.unload();
        $scope.grupo = {};
        $scope.grupos = [ ];

        $rootScope.loading.load();
        provider.obterTodos(true).then(function(success) {
          angular.forEach(success.data, function(item, index) {
            $scope.grupos.push(new GrupoProduto(GrupoProduto.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      });

      $scope.getGrupoPorCodigo = function() {
        if (!$scope.grupo.codigo) return;

        $rootScope.loading.load();
        provider.obterPorCodigo($scope.grupo.codigo).then(function(success) {
          $scope.grupo = new GrupoProduto(GrupoProduto.converterEmEntrada(success.data));
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      };

      $scope.selecionar = function(node) {
        $uibModalInstance.close(node);
      };

      $scope.fechar = function() {
        $uibModalInstance.dismiss();
      }

    }]);
