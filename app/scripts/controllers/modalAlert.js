/**
 * Created by egmfilho on 08/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .controller('ModalAlertCtrl', [
    '$scope',
    '$uibModalInstance',
    'options',
    function($scope, $uibModalInstance, options) {

      $scope.title = options.title;
      $scope.message = options.message;
      $scope.ok = options.ok;

      $scope.close = function() {
        $uibModalInstance.dismiss();
      };

    }]);
