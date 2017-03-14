/**
 * Created by egmfilho on 13/03/17.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ModalEnderecos', ['$uibModal', function($uibModal) {

    return {
      show: function() {
        $uibModal.open({
          animation: true,
          template:
            '<div id="modalEnderecos">' +
              '<div class="header">' +
                '<div class="title">' +
                  'Endereços' +
                  '<span class="glyphicon glyphicon-remove close" ng-click="cancel()"></span>' +
                '</div>' +
              '</div>' +
              '<div class="body">' +
                '<div ng-include="\'../partials/configuracoes/enderecos.html\'"></div>' +
              '</div>' +
              '<div class="control">' +
                '<button class="btn btn-default" name="positive" ng-click="ok()"><span class="glyphicon glyphicon-ok"></span> Ok</button>' +
              '</div>' +
            '</div>' ,
          controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
            console.log('ghostlights');

            $scope.ok = function() {
              $uibModalInstance.close();
            };

            $scope.cancel = function() {
              $uibModalInstance.dismiss();
            };
          }],
          size: 'lg'
        }).result.then(function(result) {

        }, function() {

        });
      }
    };

  }]);
