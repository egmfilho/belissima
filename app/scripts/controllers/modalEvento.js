/**
 * Created by egmfilho on 25/07/16.
 */
angular.module('belissimaApp')
  .controller('ModalEventoCtrl', [
    '$scope',
    '$uibModal',
    '$uibModalInstance',
    'ProviderTipoEvento',
    'TipoEvento',
    'evento',
    function($scope, $uibModal, $uibModalInstance, providerTipo, TipoEvento, evento) {

      $scope.evento = { };
      $scope.tipos = [ ];
      $scope.start = new Date();
      $scope.end = new Date();

      if (evento != null) {
        angular.extend($scope.evento, evento);
        $scope.start = $scope.evento.start.toDate();
        $scope.end = $scope.evento.end.toDate();
      }

      (function getTipos() {
        providerTipo.obterTiposDeEvento().then(function(success) {
          angular.forEach(success.data, function(item, index) {
            $scope.tipos.push(new TipoEvento(TipoEvento.converterEmEntrada(item)));
          });
        }, function(error) {
          console.log(error);
        });
      }());

      $scope.selectTipoEvento = function(tipoEvento) {
        $scope.evento.setTipo(tipoEvento);
      };

      $scope.startChanged = function() {
        if ($scope.start >= $scope.end) {
          $scope.end = new Date($scope.start.getTime() + 30 * 60000);
        } else {
          $scope.evento.start = moment($scope.start);
        }
      };

      $scope.endChanged = function() {
        if ($scope.end <= $scope.start) {
          $scope.start = new Date($scope.end.getTime() - 30 * 60000);
        } else {
          $scope.evento.end = moment($scope.end);
        }
      };

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
            if (result) {
              $uibModalInstance.close($scope.evento);
            }
          });
      };

      $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
      };

  }]);
