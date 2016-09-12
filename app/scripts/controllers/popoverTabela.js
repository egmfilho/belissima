/**
 * Created by egmfilho on 11/08/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('PopoverTabelaCtrl', ['$scope', function($scope) {

    $scope.popover = {
      isOpen: false,
      templateUrl: 'partials/popoverTabela.html',
      title: '',
      content: '',
      open: function open(data) {
        $scope.popover.isOpen = true;
        $scope.popover.data = data;
      },
      close: function close() {
        $scope.popover.isOpen = false;
      }
    };

    $scope.setContent = function(title, content) {
      $scope.popover.title = title;
      $scope.popover.content = content;
    };

  }]);
