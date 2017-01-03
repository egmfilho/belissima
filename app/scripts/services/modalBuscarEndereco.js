/**
 * Created by egmfilho on 14/09/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ModalBuscarEndereco', ['$uibModal', function($uibModal) {

    return {
      show: function(enderecos, callback) {
        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalBuscarEndereco.html',
          controller: 'ModalBuscarEnderecoCtrl',
          size: 'lg',
          resolve: {
            enderecos: function() {
              return enderecos;
            }
          }
        }).result.then(function(result) {
            callback(result);
          }, function() {
            callback(null);
          });
      }
    };

  }]);
