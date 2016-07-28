/**
 * Created by egmfilho on 25/07/16.
 */
angular.module('belissimaApp')
  .controller('ModalEventoCtrl', [
    '$scope',
    '$uibModal',
    '$uibModalInstance',
    'evento',
    function($scope, $uibModal, $uibModalInstance, evento) {

      $scope.evento = {};

      if (evento != null)
        angular.extend($scope.evento, evento);
      else {

      }

      $scope.evento.tipo = 'Selecione um tipo';

      $scope.ok = function() {

        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalConfirm.html',
          controller: 'ModalConfirmCtrl',
          size: 'sm',
          resolve: {
            options: function() {
              return {
                title: 'Aviso',
                message: 'Deseja salvar as alterações?',
                positive: 'Sim',
                negative: 'Não'
              };
            }
          }
        }).result.then(function(result) {
            if (result) $uibModalInstance.close($scope.evento);
          });
      };

      $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
      };

  }]);
