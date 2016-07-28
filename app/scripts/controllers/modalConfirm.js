/**
 * Created by egmfilho on 28/07/16.
 */
angular.module('belissimaApp')
  .controller('ModalConfirmCtrl', [
    '$scope',
    '$uibModalInstance',
    'options',
    function($scope, $uibModalInstance, options) {

      $scope.title = options.title;
      $scope.message = options.message;
      $scope.positive = options.positive;
      $scope.negative = options.negative;

      $scope.ok = function() {
        $uibModalInstance.close(true);
      };

      $scope.cancel = function() {
        $uibModalInstance.close(false);
      };

  }]);
