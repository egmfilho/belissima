/**
 * Created by egmfilho on 10/08/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ModalGrupoCtrl', [
    '$scope',
    '$uibModalInstance',
    'ProviderGrupo',
    'GrupoProduto',
    function($scope, $uibModalInstance, provider, GrupoProduto) {

      $uibModalInstance.opened.then(function() {
        $scope.grupo = {};
        $scope.grupos = [ ];

        provider.obterTodos(true).then(function(success) {
          angular.forEach(success.data, function(item, index) {
            $scope.grupos.push(new GrupoProduto(GrupoProduto.converterEmEntrada(item)));
          });
        }, function(error) {
          console.log(error);
        });
      });

      $scope.getGrupoPorCodigo = function() {
        if (!$scope.grupo.codigo) return;

        console.log('getGrupoPorCodigo()');
        provider.obterPorCodigo($scope.grupo.codigo).then(function(success) {
          $scope.grupo = new GrupoProduto(GrupoProduto.converterEmEntrada(success.data));
        }, function(error) {
          console.log(error);
        });
      };

      $scope.setGrupo = function(node) {
        $scope.grupo = node;
      };

      $scope.selecionar = function() {
        $uibModalInstance.close($scope.grupo ? $scope.grupo : null);
      };

      $scope.fechar = function() {
        $uibModalInstance.dismiss();
      }

    }]);
