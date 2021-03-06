/**
 * Created by egmfilho on 26/01/17.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ModalPermissaoCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderPermissao',
    'options',
    function($rootScope, $scope, $uibModalInstance, providerPermissao, options) {

      $uibModalInstance.opened.then(function() {
        setTimeout(function() {
          jQuery('#modalPermissao input[ng-model="permissao.usuario"]').focus();
        }, 100);
      });

      $scope.avancar = function() {
        jQuery('#modalPermissao input[ng-model="permissao.senha"]').focus().select();
      };

      $scope.ok = function(usuario, senha) {
        if (!usuario || !senha) {
          return;
        }

        $rootScope.loading.load();
        providerPermissao.autorizar(options.modulo, options.permissao, usuario, senha).then(function(success) {
          if (success.data.value == 'Y') {
            $rootScope.loading.unload();
            $uibModalInstance.close();
          } else {
            $rootScope.loading.unload();
            $rootScope.alerta.show('Permissão negada!', 'alert-danger');
          }
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
          $rootScope.alerta.show(error.data.status.description, 'alert-danger');
          jQuery('#modalPermissao input[ng-model="permissao.usuario"]').focus().select();
        });
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };

    }]);
