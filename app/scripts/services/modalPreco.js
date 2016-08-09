/**
 * Created by egmfilho on 09/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('ModalPreco', ['$uibModal', function($uibModal) {

    return {
      show: function(produto, callback) {
        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalPreco.html',
          controller: 'ModalPrecoCtrl',
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
