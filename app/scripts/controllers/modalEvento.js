/**
 * Created by egmfilho on 25/07/16.
 */
angular.module('belissimaApp')
  .controller('ModalEventoCtrl', ['$scope', 'evento', function($scope, evento) {

    $scope.evento = evento;

  }]);
