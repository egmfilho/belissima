/**
 * Created by egmfilho on 22/11/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ModalBuscarPrazoPagamento', ['$uibModal', function($uibModal) {

    return {
      show: function(key) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalBuscarPrazoPagamento.html',
          controller: 'ModalBuscarPrazoPagamentoCtrl',
          size: 'md',
          resolve: {
            key: function() {
              return key;
            }
          }
        }).result;
      }
    }

  }]);

