/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('ModalBuscarPessoa', ['$uibModal', function($uibModal) {

    return {
      show: function(pessoa, callback) {
        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalBuscarPessoa.html',
          controller: 'ModalBuscarPessoaCtrl',
          size: 'lg',
          resolve: {
            pessoa: function() {
              return {
                pessoa: pessoa
              };
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
