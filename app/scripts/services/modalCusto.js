/**
 * Created by egmfilho on 11/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ModalCusto', ['$uibModal', function($uibModal) {

    return {
      show: function(produto, callback) {
        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalCusto.html',
          controller: 'ModalCustoCtrl',
          size: 'lg',
          resolve: {
            produto: function() {
              return produto;
            }
          }
        }).result.then(function(result) {
            callback(result);
          }, function() {
            callback(null);
          });
      }
    }

  }]);
