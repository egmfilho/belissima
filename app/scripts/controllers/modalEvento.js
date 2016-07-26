/**
 * Created by egmfilho on 25/07/16.
 */
angular.module('belissimaApp')
  .controller('ModalEventoCtrl', ['$scope', '$uibModalInstance', 'evento', function($scope, $uibModalInstance, evento) {

    $scope.evento = evento;

    $scope.close = function() {
      $uibModalInstance.dismiss('cancel');
    };

  }]);
