/**
 * Created by egmfilho on 14/09/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ModalEditarPessoa', ['$uibModal', function($uibModal) {

    return {
      show: function(pessoa, callback) {
        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalEditarPessoa.html',
          controller: 'ModalEditarPessoaCtrl',
          size: 'lg',
          resolve: {
            pessoa: function() {
              return pessoa;
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
