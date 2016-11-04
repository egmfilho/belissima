/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ModalBuscarPessoa', ['$uibModal', function($uibModal) {

    return {
      show: function(categoriaId) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalBuscarPessoa.html',
          controller: 'ModalBuscarPessoaCtrl',
          size: 'lg',
          resolve: {
            categoriaId: function() {
              return categoriaId;
            }
          }
        }).result;
      }
    }

  }]);
