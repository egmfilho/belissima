/**
 * Created by egmfilho on 28/07/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ModalConfirmCtrl', [
    '$scope',
    '$uibModalInstance',
    'KEY_CODES',
    'options',
    function($scope, $uibModalInstance, KEY_CODES, options) {

      $scope.title = options.title;
      $scope.message = options.message;
      $scope.positive = options.positive;
      $scope.negative = options.negative;

      $uibModalInstance.opened.then(function() {
        setTimeout(function() {
          jQuery('#modalConfirm button[name="positive"]').focus();
        }, 100);
      });

      $scope.ok = function() {
        $uibModalInstance.close();
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };

  }]);
