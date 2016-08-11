/**
 * Created by egmfilho on 11/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .controller('PopoverTabelaCtrl', ['$scope', function($scope) {

    $scope.popover = {
      isOpen: false,
      templateUrl: 'partials/popoverTabela.html',
      open: function open(data) {
        $scope.popover.isOpen = true;
        $scope.popover.data = data;
      },
      close: function close() {
        $scope.popover.isOpen = false;
      }
    };

  }]);
